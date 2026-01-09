import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const createOrderService = async (userId, shippingData) => {
    // 1. Lấy giỏ hàng của user
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    let totalAmount_cents = 0;
    const orderItems = [];

    // 2. Duyệt qua từng món trong giỏ để:
    //    - Kiểm tra tồn kho
    //    - Tạo Snapshot (Lưu cứng tên/giá)
    //    - Tính tổng tiền
    //    - Trừ kho (Logic C của bạn)
    for (const item of cart.items) {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error(`Product not found: ${item.productId}`);

        // Giả sử mua variant đầu tiên (vì Cart chưa có variantId)
        const variant = product.variants[0]; 

        // Kiểm tra đủ hàng không
        if (variant.stock < item.quantity) {
            throw new Error(`Product ${product.name} is out of stock`);
        }

        // --- HÀNH ĐỘNG 5: TRỪ KHO (Logic C) ---
        variant.stock -= item.quantity;
        await product.save(); // Lưu lại số lượng mới vào DB Product

        // Tạo Snapshot cho Order Item
        orderItems.push({
            productId: product._id,
            name: product.name,        // Lưu cứng tên
            price_cents: product.price_cents, // Lưu cứng giá
            image: product.images[0]?.imageUrl,
            quantity: item.quantity
        });

        totalAmount_cents += product.price_cents * item.quantity;
    }

    // 3. Tạo Đơn hàng mới
    const newOrder = await Order.create({
        userId,
        items: orderItems,
        totalAmount_cents,
        shippingAddress: shippingData.shippingAddress,
        phoneNumber: shippingData.phoneNumber,
        note: shippingData.note,
        paymentMethod: shippingData.paymentMethod || "COD"
    });

    // 4. Xóa sạch giỏ hàng sau khi chốt đơn thành công
    cart.items = [];
    await cart.save();

    return newOrder;
};

// Hàm lấy lịch sử đơn hàng của user
export const getMyOrdersService = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};