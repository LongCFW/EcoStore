import Order from "../models/order.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";
import mongoose from "mongoose";

export const createOrderService = async (userId, shippingData) => {
    const session = await mongoose.startSession();
    session.startTransaction(); // Bắt đầu giao dịch

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            throw new Error("Cart is empty");
        }

        let totalAmount_cents = 0;
        const orderItems = [];

        for (const item of cart.items) {
            // Tìm product trong session này
            const product = await Product.findById(item.productId).session(session);
            if (!product) throw new Error(`Product not found: ${item.productId}`);

            // Luôn thao tác với variant đầu tiên
            const variant = product.variants[0];

            if (variant.stock < item.quantity) {
                throw new Error(`Product ${product.name} is out of stock`);
            }

            // Trừ kho
            variant.stock -= item.quantity;
            
            // Lưu sản phẩm (với session)
            await product.save({ session });

            // Snapshot
            orderItems.push({
                productId: product._id,
                name: product.name,
                variantName: variant.sku, // Hoặc kết hợp attributes màu/size
                price_cents: variant.price_cents, // Lấy giá của Variant
                image: product.images[0]?.imageUrl,
                quantity: item.quantity
            });

            totalAmount_cents += variant.price_cents * item.quantity;
        }

        // Tạo Order
        const newOrder = await Order.create([{
            userId,
            items: orderItems,
            totalAmount_cents,
            shippingAddress: shippingData.shippingAddress,
            phoneNumber: shippingData.phoneNumber,
            note: shippingData.note,
            paymentMethod: shippingData.paymentMethod || "COD"
        }], { session }); // Quan trọng: Phải truyền session vào options của create (dạng array)

        // Xóa cart
        cart.items = [];
        await cart.save({ session });

        // Commit transaction (Lưu tất cả thay đổi)
        await session.commitTransaction();
        session.endSession();

        return newOrder[0]; // create với session trả về mảng
    } catch (error) {
        // Nếu có lỗi, rollback (hoàn tác) tất cả
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};

// Hàm lấy lịch sử đơn hàng của user
export const getMyOrdersService = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};