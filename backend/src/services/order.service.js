import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import User from "../models/user.js"; // Import thêm User để lấy email
import sendEmail from "../utils/sendEmail.js"; // Import hàm gửi mail
import { orderConfirmationTemplate } from "../utils/emailTemplates.js";

// --- CLIENT: TẠO ĐƠN HÀNG ---
export const createOrderService = async (userId, orderData) => {   
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) throw new Error("Giỏ hàng trống");

    let totalAmount_cents = 0;
    const orderItems = [];

    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);

        const variant = product.variants?.[0]; 
        if (!variant) throw new Error(`Sản phẩm ${product.name} lỗi dữ liệu (không có variant)`);

        if (variant.stock < item.quantity) throw new Error(`Sản phẩm ${product.name} đã hết hàng`);

        variant.stock -= item.quantity;
        await product.save(); 

        orderItems.push({
            productId: product._id,
            name: product.name,
            price_cents: variant.price_cents,
            image: product.images?.[0]?.imageUrl || "",
            quantity: item.quantity
        });

        totalAmount_cents += variant.price_cents * item.quantity;
    }

    const SHIPPING_FEE = 30000;
    const FREESHIP_THRESHOLD = 300000;
    let finalTotal = totalAmount_cents;
    
    if (totalAmount_cents < FREESHIP_THRESHOLD) {
        finalTotal += SHIPPING_FEE;
    }

    const newOrder = await Order.create({
        userId,
        orderNumber: `ORD-${Date.now()}`,
        items: orderItems,
        totalAmount_cents: finalTotal,
        shippingAddress: orderData.shippingAddress,
        phoneNumber: orderData.phoneNumber,
        note: orderData.note,
        paymentMethod: orderData.paymentMethod || "COD",
        status: "pending"
    });

    cart.items = [];
    await cart.save();

    const user = await User.findById(userId);

    // --- GHI LOG: THANH TOÁN (ĐẶT HÀNG) ---
    if (user) {
        user.activityLogs.push({
            action: "ĐẶT HÀNG THÀNH CÔNG",
            details: `Đã đặt đơn hàng #${newOrder.orderNumber} trị giá ${finalTotal.toLocaleString()}đ.`
        });
        await user.save();
    }

    // 6 GỬI EMAIL XÁC NHẬN (NON-BLOCKING)
    if (user && user.email) {
        sendEmail({
            email: user.email,
            subject: `Xác nhận đơn hàng #${newOrder.orderNumber} - EcoStore`,
            html: orderConfirmationTemplate(newOrder, user.name || "Khách hàng"),
        }).catch(err => {
            console.error("⚠️ Lỗi gửi mail ngầm (Không ảnh hưởng đơn hàng):", err.message);
        });
    }

    return newOrder;
};

// --- CLIENT: LẤY ĐƠN HÀNG CỦA TÔI ---
export const getMyOrdersService = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 }); // Mới nhất lên đầu
};

// --- ADMIN: LẤY TẤT CẢ ĐƠN HÀNG ---
export const getAllOrdersService = async (query) => {
    // query có thể là ?status=pending hoặc ?page=1
    const filter = {};
    if (query.status && query.status !== 'all') {
        filter.status = query.status;
    }

    const orders = await Order.find(filter)
        .populate('userId', 'name email') // Lấy thêm tên người mua
        .sort({ createdAt: -1 });
        
    return orders;
};

// --- ADMIN: CẬP NHẬT TRẠNG THÁI ---
export const updateOrderStatusService = async (orderId, status) => {
    const order = await Order.findByIdAndUpdate(
        orderId, 
        { status }, 
        { new: true }
    );
    if (!order) throw new Error("Order not found");
    return order;
};

// LẤY ĐƠN HÀNG CỦA MỘT USER CỤ THỂ 
export const getOrdersByUserIdForAdmin = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};