import {
    createOrderService,
    getMyOrdersService,
    getAllOrdersService,
    updateOrderStatusService,
    getOrdersByUserIdForAdmin, handlePayOSWebhookService
} from "../services/order.service.js";

// Client: Tạo đơn
export const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        // orderData bao gồm: shippingAddress, phoneNumber, note, paymentMethod
        const order = await createOrderService(userId, req.body);

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Client: Xem lịch sử
export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orders = await getMyOrdersService(userId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

// Admin: Lấy tất cả
export const getAllOrders = async (req, res, next) => {
    try {
        const orders = await getAllOrdersService(req.query);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

// Admin: Cập nhật trạng thái
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = await updateOrderStatusService(id, status);
        res.json({ success: true, message: "Update status success", data: order });
    } catch (error) {
        next(error);
    }
};

export const getOrdersByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const orders = await getOrdersByUserIdForAdmin(userId);
        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        next(error);
    }
};

// --- XỬ LÝ WEBHOOK TỪ PAYOS ---
export const payosWebhook = async (req, res) => {
    try {
        // Chuyển dữ liệu cho Service xử lý
        await handlePayOSWebhookService(req.body);

        // PayOS yêu cầu trả về status 200 và json có dạng thế này để xác nhận đã nhận được thông báo
        res.status(200).json({
            success: true,
            error: 0,
            message: "Webhook processed",
            data: null
        });
    } catch (error) {
        // Dù lỗi cũng trả về 200 để PayOS không bị kẹt vòng lặp spam request
        res.status(200).json({ success: false, error: -1, message: error.message });
    }
};