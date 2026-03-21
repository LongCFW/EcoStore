import express from "express";
// import { body } from "express-validator"; // Comment hoặc xóa dòng này
import { 
    createOrder, 
    getMyOrders, 
    getAllOrders, 
    updateOrderStatus,
    getOrdersByUser,
    payosWebhook, getDashboardStats
} from "../controllers/order.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js"; 
import { requireRole } from "../middlewares/role.middleware.js";
import Order from "../models/order.js";
// import { validateRequest } from "../middlewares/validate.middleware.js"; // Comment hoặc xóa dòng này

const router = express.Router();

// ROUTE PUBLIC: MỞ CỬA CHO PAYOS VÀO BÁO TIN (KHÔNG CẦN TOKEN)
router.post("/payos-webhook", payosWebhook);

// Tất cả route đều cần đăng nhập (xác thực user trước)
router.use(verifyToken);


// ĐOẠN API TỰ ĐỘNG HỦY ĐƠN KHI KHÁCH "QUAY XE" VÀO ĐÂY
router.put("/payos/cancel", async (req, res) => {
    try {
        const { orderCode } = req.body;
        // Tìm đơn hàng của user này và có mã PayOS tương ứng
        const order = await Order.findOne({ userId: req.user.id, payosOrderCode: Number(orderCode) });
        
        // Nếu tìm thấy và nó đang chờ thanh toán -> Đổi sang Đã Hủy
        if (order && order.status === "pending") {
            order.status = "cancelled";
            order.statusHistory.push({ 
                status: "cancelled", 
                note: "Khách hàng đã hủy quét mã thanh toán PayOS" 
            });
            await order.save();
        }
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- CLIENT ROUTES (Khách hàng) ---
// ĐÃ SỬA: Tháo bỏ middleware validate để cho phép selectedItemIds đi qua
router.post("/", createOrder); 

router.get("/my-orders", getMyOrders);

// --- ADMIN / MANAGER / STAFF ROUTES ---
router.get("/admin/all", requireRole(['admin', 'manager', 'staff']), getAllOrders);
router.get("/admin/dashboard-stats", requireRole(['admin', 'manager', 'staff']), getDashboardStats);
router.get("/admin/user/:userId", requireRole(['admin', 'manager', 'staff']), getOrdersByUser);
router.put("/admin/:id/status", requireRole(['admin', 'manager', 'staff']), updateOrderStatus);

export default router;