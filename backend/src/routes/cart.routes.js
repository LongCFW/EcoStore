import express from "express";
import { getCart, addToCart, updateCartItem, removeCartItem } from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Tất cả các route dưới đây đều yêu cầu đăng nhập
router.use(authMiddleware);

router.get("/", getCart);             // Lấy giỏ hàng
router.post("/add", addToCart);       // Thêm sản phẩm
router.put("/update", updateCartItem);// Cập nhật số lượng
router.delete("/remove/:productId", removeCartItem); // Xóa sản phẩm (productId trên URL)

export default router;