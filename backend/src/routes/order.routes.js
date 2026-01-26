import express from "express";
import { body } from "express-validator";
import { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/order.controller.js";
// Dùng verifyToken và isAdmin từ file middleware chuẩn của bạn
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js"; 
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Tất cả route đều cần đăng nhập
router.use(verifyToken);

// --- CLIENT ROUTES ---
router.post(
    "/",
    [
        body("shippingAddress").notEmpty().withMessage("Vui lòng nhập địa chỉ"),
        body("phoneNumber").notEmpty().withMessage("Vui lòng nhập số điện thoại"),
    ],
    validateRequest,
    createOrder
);

router.get("/my-orders", getMyOrders); // Đổi path thành /my-orders cho rõ ràng

// --- ADMIN ROUTES ---
// Admin xem tất cả đơn hàng
router.get("/admin/all", isAdmin, getAllOrders);

// Admin cập nhật trạng thái đơn hàng (VD: /api/orders/admin/:id/status)
router.put("/admin/:id/status", isAdmin, updateOrderStatus);

export default router;