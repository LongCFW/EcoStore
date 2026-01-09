import { createOrderService, getMyOrdersService } from "../services/order.service.js";

// Tạo đơn hàng
export const createOrder = async (req, res, next) => {
    try {
        const userId = req.user.userId; // Lấy từ Token
        const { shippingAddress, phoneNumber, note, paymentMethod } = req.body;

        // Gọi service
        const order = await createOrderService(userId, {
            shippingAddress,
            phoneNumber,
            note,
            paymentMethod
        });

        // Trả về 201 Created
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// Lấy lịch sử đơn hàng
export const getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const orders = await getMyOrdersService(userId);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};