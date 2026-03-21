// backend/src/services/cart.service.js
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js";

// Lấy giỏ hàng (Có logic tự dọn dẹp item rác)
export const getCartService = async (userId) => {
    let cart = await Cart.findOne({ userId }).populate("items.productId", "name price_cents images slug is_active");

    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
        return cart;
    }

    // Lọc bỏ các sản phẩm bị null (đã xóa khỏi DB Product)
    // Dùng filter javascript thông thường vì ta đang cần trả về dữ liệu hiển thị
    const validItems = cart.items.filter(item => item.productId !== null);

    // Nếu có sự thay đổi (có rác), cập nhật lại DB bằng updateOne (tránh dùng save() để ko lỗi version)
    if (validItems.length !== cart.items.length) {
        await Cart.updateOne({ _id: cart._id }, { items: validItems });
        cart.items = validItems; // Cập nhật lại biến cục bộ để trả về
    }

    return cart;
};

// Thêm vào giỏ
export const addToCartService = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant ? defaultVariant._id : null;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        cart = await Cart.create({
            userId,
            items: [{ productId, quantity, variantId }]
        });
    } else {
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            await Cart.findOneAndUpdate(
                { userId, "items.productId": productId },
                { $inc: { "items.$.quantity": quantity } }
            );
        } else {
            await Cart.findOneAndUpdate(
                { userId },
                { $push: { items: { productId, variantId, quantity } } }
            );
        }
    }

    // --- GHI LOG: THÊM VÀO GIỎ ---
    await User.findByIdAndUpdate(userId, {
        $push: {
            activityLogs: {
                action: "THÊM VÀO GIỎ",
                details: `Đã thêm ${quantity} x [${product.name}] vào giỏ hàng.`
            }
        }
    });

    return await getCartService(userId);
};

// Cập nhật số lượng (Dùng $set thay vì save)
export const updateCartItemService = async (userId, productId, quantity) => {
    if (quantity <= 0) {
        return await removeCartItemService(userId, productId);
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { userId, "items.productId": productId },
        { $set: { "items.$.quantity": quantity } },
        { new: true } 
    );

    if (!updatedCart) throw new Error("Cart or Product not found");

    return await getCartService(userId);
};

export const removeCartItemService = async (userId, productId) => {
    // 1. Lấy tên sản phẩm trước khi xóa để ghi log
    const product = await Product.findById(productId);
    const productName = product ? product.name : 'Sản phẩm đã xóa';

    // 2. Xóa khỏi giỏ
    await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId: productId } } }
    );

    // --- GHI LOG: XÓA KHỎI GIỎ ---
    await User.findByIdAndUpdate(userId, {
        $push: {
            activityLogs: {
                action: "XÓA KHỎI GIỎ",
                details: `Đã bỏ [${productName}] ra khỏi giỏ hàng.`
            }
        }
    });

    return await getCartService(userId);
};