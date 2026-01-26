import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

// --- CLIENT: TẠO ĐƠN HÀNG ---
export const createOrderService = async (userId, orderData) => {
    // 1. Lấy giỏ hàng
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
        throw new Error("Giỏ hàng trống");
    }

    let totalAmount_cents = 0;
    const orderItems = [];

    // 2. Duyệt qua từng sản phẩm để check tồn kho và tính tiền
    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Sản phẩm không tồn tại: ${item.productId}`);

        // Logic lấy biến thể: Mặc định lấy variants[0] như bạn yêu cầu
        const variant = product.variants?.[0]; 
        if (!variant) throw new Error(`Sản phẩm ${product.name} lỗi dữ liệu (không có variant)`);

        if (variant.stock < item.quantity) {
            throw new Error(`Sản phẩm ${product.name} đã hết hàng`);
        }

        // Trừ tồn kho
        variant.stock -= item.quantity;
        await product.save(); // Lưu lại sản phẩm đã trừ kho

        // Snapshot dữ liệu vào Order (Lưu lại giá và tên tại thời điểm mua)
        orderItems.push({
            productId: product._id,
            name: product.name,
            price_cents: variant.price_cents,
            image: product.images?.[0]?.imageUrl || "",
            quantity: item.quantity
        });

        totalAmount_cents += variant.price_cents * item.quantity;
    }

    // 3. Tính phí ship (Logic Backend tự tính để bảo mật)
    const SHIPPING_FEE = 30000;
    const FREESHIP_THRESHOLD = 300000;
    let finalTotal = totalAmount_cents;
    
    // Nếu tổng đơn nhỏ hơn 300k thì cộng ship, ngược lại free
    if (totalAmount_cents < FREESHIP_THRESHOLD) {
        finalTotal += SHIPPING_FEE;
    }

    // 4. Tạo Order
    const newOrder = await Order.create({
        userId,
        orderNumber: `ORD-${Date.now()}`, // Mã đơn hàng duy nhất
        items: orderItems,
        totalAmount_cents: finalTotal,
        shippingAddress: orderData.shippingAddress,
        phoneNumber: orderData.phoneNumber,
        note: orderData.note,
        paymentMethod: orderData.paymentMethod || "COD",
        status: "pending"
    });

    // 5. Xóa giỏ hàng sau khi đặt thành công
    cart.items = [];
    await cart.save();

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