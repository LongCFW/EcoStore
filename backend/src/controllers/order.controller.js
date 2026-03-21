import {
    createOrderService,
    getMyOrdersService,
    getAllOrdersService,
    updateOrderStatusService,
    getOrdersByUserIdForAdmin, handlePayOSWebhookService
} from "../services/order.service.js";

import Order from "../models/order.js";
import User from "../models/user.js";

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

// --- API THỐNG KÊ DASHBOARD (REAL-TIME) ---
export const getDashboardStats = async (req, res, next) => {
    try {
        const totalOrders = await Order.countDocuments();
        
        // 1. LỌC KHÁCH HÀNG CHUẨN: Lấy tất cả user, bóc tách những ai KHÔNG PHẢI là nội bộ
        const allUsers = await User.find().populate('role');
        const totalUsers = allUsers.filter(u => {
            if (!u.role) return true; // Nếu không có role (bỏ trống), mặc định 100% là Khách Hàng
            const rName = u.role.name?.toLowerCase();
            return !['admin', 'manager', 'staff'].includes(rName); // Trừ đội ngũ nhân viên ra
        }).length;

        // --- BỘ LỌC DOANH THU CHUẨN (Chỉ lấy tiền từ đơn đã thanh toán hoặc chốt) ---
        const validRevenueMatch = {
            $or: [
                { paymentStatus: 'paid' },
                { status: 'delivered' },
                { status: 'completed' },
                { status: 'confirmed' }
            ]
        };

        // 2. TỔNG DOANH THU THỰC TẾ
        const revenueResult = await Order.aggregate([
            { $match: validRevenueMatch },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount_cents" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // 3. ĐƠN HÀNG GẦN ĐÂY
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('userId', 'name');

        // 4. SẢN PHẨM HOT (TOP BÁN CHẠY)
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } }, // Bỏ qua đơn hủy
            { $unwind: "$items" },
            { $group: { 
                _id: "$items.productId", 
                name: { $first: "$items.name" }, 
                image: { $first: "$items.image" }, 
                sold: { $sum: "$items.quantity" } 
            }},
            { $sort: { sold: -1 } },
            { $limit: 4 }
        ]);

        // 5. BIỂU ĐỒ DOANH THU 7 NGÀY (Ép dùng chung Bộ Lọc Doanh Thu Chuẩn)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const dailyRevenue = await Order.aggregate([
            { $match: { 
                createdAt: { $gte: sevenDaysAgo },
                ...validRevenueMatch // ÉP LUẬT: Biểu đồ chỉ được cộng tiền của đơn thành công!
            }},
            { $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt", timezone: "+07:00" } },
                revenue: { $sum: "$totalAmount_cents" }
            }}
        ]);

        const revenueData = [];
        const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
        for (let i = 0; i < 7; i++) {
            const d = new Date(sevenDaysAgo);
            d.setDate(d.getDate() + i);
            
            // Format ngày tháng bám sát chuẩn Giờ Việt Nam
            const dateString = d.toLocaleDateString('sv-SE', { timeZone: 'Asia/Ho_Chi_Minh' });
            const dayName = daysOfWeek[d.getDay()];
            
            const found = dailyRevenue.find(r => r._id === dateString);
            revenueData.push({
                name: dayName,
                uv: found ? found.revenue : 0
            });
        }

        // 6. DANH MỤC ĐÓNG GÓP (PIE CHART) - Dùng Lookup để kéo thẳng tên Category từ Database
        const categoryDataRaw = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $unwind: "$items" },
            // Kết nối vào bảng Products
            { $lookup: {
                from: "products", 
                localField: "items.productId",
                foreignField: "_id",
                as: "productInfo"
            }},
            { $unwind: "$productInfo" },
            // Kết nối tiếp vào bảng Categories
            { $lookup: {
                from: "categories", 
                localField: "productInfo.categoryId",
                foreignField: "_id",
                as: "categoryInfo"
            }},
            { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
            { $group: {
                _id: { $ifNull: ["$categoryInfo.name", "Chưa phân loại"] }, // Nếu rớt data thì cho vào nhóm Chưa phân loại
                value: { $sum: "$items.quantity" }
            }},
            { $sort: { value: -1 } },
            { $limit: 4 }
        ]);
        
        const categoryData = categoryDataRaw.map(c => ({
            name: c._id.length > 15 ? c._id.substring(0, 15) + '...' : c._id, // Cắt ngắn tên nếu quá dài
            value: c.value
        }));

        res.status(200).json({
            success: true,
            data: {
                totalOrders,
                totalUsers,
                totalRevenue,
                recentOrders,
                topProducts,
                revenueData,
                categoryData: categoryData.length > 0 ? categoryData : [{ name: 'Chưa có data', value: 1 }]
            }
        });
    } catch (error) {
        next(error);
    }
};