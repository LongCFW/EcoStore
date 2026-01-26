// backend/src/services/cart.service.js
import Cart from "../models/cart.js";
import Product from "../models/product.js";

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

// Thêm vào giỏ (Giữ nguyên logic cũ nhưng tối ưu)
export const addToCartService = async (userId, productId, quantity = 1) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    // Lấy variant mặc định
    const defaultVariant = product.variants?.[0];
    const variantId = defaultVariant ? defaultVariant._id : null;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
        // Tạo mới nếu chưa có
        cart = await Cart.create({
            userId,
            items: [{ productId, quantity, variantId }]
        });
    } else {
        // Kiểm tra item đã tồn tại chưa
        const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

        if (itemIndex > -1) {
            // Dùng $inc để cộng dồn số lượng (Atomic update) - Tránh lỗi race condition
            await Cart.findOneAndUpdate(
                { userId, "items.productId": productId },
                { $inc: { "items.$.quantity": quantity } }
            );
        } else {
            // Dùng $push để thêm mới (Atomic update)
            await Cart.findOneAndUpdate(
                { userId },
                { $push: { items: { productId, variantId, quantity } } }
            );
        }
    }

    // Trả về cart mới nhất đã populate
    return await getCartService(userId);
};

// Cập nhật số lượng (Dùng $set thay vì save)
export const updateCartItemService = async (userId, productId, quantity) => {
    if (quantity <= 0) {
        // Nếu số lượng <= 0 thì gọi hàm xóa
        return await removeCartItemService(userId, productId);
    }

    // Dùng $set để cập nhật trực tiếp item cụ thể trong mảng
    // "items.productId": productId -> Tìm item khớp
    // "items.$.quantity": quantity -> Cập nhật quantity của item tìm thấy ($)
    const updatedCart = await Cart.findOneAndUpdate(
        { userId, "items.productId": productId },
        { $set: { "items.$.quantity": quantity } },
        { new: true } // Trả về document sau khi update
    );

    if (!updatedCart) throw new Error("Cart or Product not found");

    return await getCartService(userId);
};

// Xóa sản phẩm (Dùng $pull thay vì save - FIX LỖI VERSION ERROR)
export const removeCartItemService = async (userId, productId) => {
    // $pull: Kéo (xóa) phần tử ra khỏi mảng khớp điều kiện
    await Cart.findOneAndUpdate(
        { userId },
        { $pull: { items: { productId: productId } } }
    );

    return await getCartService(userId);
};