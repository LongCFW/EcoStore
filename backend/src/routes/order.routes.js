import express from "express";
import { body } from "express-validator";
import { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus 
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; 
// Import middleware phân quyền
import { requireRole } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// Tất cả route đều cần đăng nhập (xác thực user trước)
router.use(verifyToken);

// --- CLIENT ROUTES (Khách hàng) ---
router.post(
    "/",
    [
        body("shippingAddress").notEmpty().withMessage("Vui lòng nhập địa chỉ"),
        body("phoneNumber").notEmpty().withMessage("Vui lòng nhập số điện thoại"),
    ],
    validateRequest,
    createOrder
);

router.get("/my-orders", getMyOrders);

// --- ADMIN / MANAGER / STAFF ROUTES ---
// Yêu cầu: Admin, Manager, Staff đều xem và cập nhật được

router.get(
    "/admin/all", 
    requireRole(['admin', 'manager', 'staff']), 
    getAllOrders
);

router.put(
    "/admin/:id/status", 
    requireRole(['admin', 'manager', 'staff']), 
    updateOrderStatus
);

export default router;