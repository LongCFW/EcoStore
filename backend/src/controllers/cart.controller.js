import { 
    getCartService, 
    addToCartService, 
    updateCartItemService, 
    removeCartItemService 
} from "../services/cart.service.js";

// Lấy giỏ hàng
export const getCart = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Lấy từ Token
        const cart = await getCartService(userId);
        res.status(200).json({ success: true, data: cart });
    } catch (error) {
        next(error);
    }
};

// Thêm vào giỏ
export const addToCart = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        const cart = await addToCartService(userId, productId, quantity);
        res.status(200).json({ success: true, message: "Added to cart", data: cart });
    } catch (error) {
        next(error);
    }
};

// Cập nhật số lượng
export const updateCartItem = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId, quantity } = req.body;

        const cart = await updateCartItemService(userId, productId, quantity);
        res.status(200).json({ success: true, message: "Cart updated", data: cart });
    } catch (error) {
        next(error);
    }
};

// Xóa sản phẩm
export const removeCartItem = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { productId } = req.params; // Lấy productId từ URL

        const cart = await removeCartItemService(userId, productId);
        res.status(200).json({ success: true, message: "Item removed", data: cart });
    } catch (error) {
        next(error);
    }
};