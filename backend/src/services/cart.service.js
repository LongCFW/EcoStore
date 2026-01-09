import Cart from "../models/cart.js";
import Product from "../models/product.js";

// Lấy giỏ hàng của user
export const getCartService = async (userId) => {
    // Tìm giỏ hàng và hiển thị chi tiết thông tin sản phẩm (name, price, image)
    let cart = await Cart.findOne({ userId }).populate("items.productId", "name price_cents images slug");
    
    // Nếu chưa có giỏ hàng, tạo một cái rỗng để trả về (tránh lỗi null ở frontend)
    if (!cart) {
        cart = await Cart.create({ userId, items: [] });
    }
    return cart;
};

// Thêm sản phẩm vào giỏ
export const addToCartService = async (userId, productId, quantity = 1) => {
    // 1. Kiểm tra sản phẩm có tồn tại không
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");

    // 2. Tìm giỏ hàng của user
    let cart = await Cart.findOne({ userId });

    // Trường hợp 1: User chưa có giỏ hàng -> Tạo mới
    if (!cart) {
        cart = await Cart.create({
            userId,
            items: [{ productId, quantity }]
        });
    } else {
        // Trường hợp 2: Giỏ hàng đã tồn tại -> Kiểm tra sản phẩm đã có trong giỏ chưa
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // SP đã có -> Cộng dồn số lượng
            cart.items[itemIndex].quantity += quantity;
        } else {
            // SP chưa có -> Thêm mới vào mảng
            cart.items.push({ productId, quantity });
        }
        await cart.save();
    }

    return cart; // Trả về giỏ hàng mới nhất
};

// Cập nhật số lượng (Tăng/Giảm)
export const updateCartItemService = async (userId, productId, quantity) => {
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new Error("Cart not found");

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex > -1) {
        if (quantity > 0) {
            cart.items[itemIndex].quantity = quantity;
        } else {
            // Nếu số lượng <= 0 thì xóa luôn
            cart.items.splice(itemIndex, 1);
        }
        await cart.save();
    }
    return cart;
};

// Xóa sản phẩm khỏi giỏ
export const removeCartItemService = async (userId, productId) => {
    const cart = await Cart.findOne({ userId });
    if (cart) {
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
    }
    return cart;
};