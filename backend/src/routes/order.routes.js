import express from "express";
// import { body } from "express-validator"; // Comment hoặc xóa dòng này
import { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus,
    getOrdersByUser
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; 
import { requireRole } from "../middlewares/role.middleware.js";
// import { validateRequest } from "../middlewares/validate.middleware.js"; // Comment hoặc xóa dòng này

const router = express.Router();

// Tất cả route đều cần đăng nhập (xác thực user trước)
router.use(verifyToken);

// --- CLIENT ROUTES (Khách hàng) ---
// ĐÃ SỬA: Tháo bỏ middleware validate để cho phép selectedItemIds đi qua
router.post("/", createOrder); 

router.get("/my-orders", getMyOrders);

// --- ADMIN / MANAGER / STAFF ROUTES ---
router.get("/admin/all", requireRole(['admin', 'manager', 'staff']), getAllOrders);
router.get("/admin/user/:userId", requireRole(['admin', 'manager', 'staff']), getOrdersByUser);
router.put("/admin/:id/status", requireRole(['admin', 'manager', 'staff']), updateOrderStatus);

export default router;