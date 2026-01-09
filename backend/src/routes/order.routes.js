import express from "express";
import { body } from "express-validator"; // Dùng để kiểm tra dữ liệu
import { createOrder, getMyOrders } from "../controllers/order.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Tất cả các route đơn hàng đều yêu cầu đăng nhập
router.use(authMiddleware);

// 1. Tạo đơn hàng (Checkout)
router.post(
    "/",
    [
        body("shippingAddress").notEmpty().withMessage("Shipping address is required"),
        body("phoneNumber").notEmpty().withMessage("Phone number is required"),
        // paymentMethod và note là optional (không bắt buộc) nên không cần check
    ],
    validateRequest,
    createOrder
);

// 2. Xem lịch sử đơn hàng của tôi
router.get("/", getMyOrders);

export default router;