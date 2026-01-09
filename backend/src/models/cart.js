import mongoose from "mongoose";

const { Schema } = mongoose;

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    // Có thể thêm giá tại thời điểm thêm vào giỏ nếu muốn giữ giá cố định
    // price: Number 
}, { _id: false }); // Không cần ID riêng cho từng item con

const CartSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [CartItemSchema],
    // Tổng tiền tạm tính (optional, có thể tính toán động)
}, { timestamps: true });

export default mongoose.model("Cart", CartSchema);