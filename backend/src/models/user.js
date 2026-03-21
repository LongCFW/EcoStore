import mongoose from "mongoose";
const { Schema } = mongoose;

// 1. Định nghĩa Address Schema trước
const AddressSchema = new Schema({
    fullName: String,
    phone: String,
    addressLine: String,
    city: String,
    province: String,
    postalCode: String,
    country: String,
    isDefault: Boolean
}, { _id: true });

// 2. Định nghĩa ActivityLog Schema kế tiếp
const ActivityLogSchema = new Schema({
    action: { type: String, required: true }, // VD: "ADD_TO_CART", "CHECKOUT", "ADD_WISHLIST"
    details: { type: String },                // VD: "Thêm sản phẩm Rau Củ vào giỏ hàng"
    createdAt: { type: Date, default: Date.now }
});

// 3. Cuối cùng mới định nghĩa User Schema (Sử dụng 2 Schema trên)
const UserSchema = new Schema({
    email: { type: String, unique: true },
    password_hash: String,
    name: String,
    phone: String,
    avatarUrl: String,
    role: { type: Schema.Types.ObjectId, ref: "Role" },
    status: { type: Number, default: 1 },
    addresses: [AddressSchema],    
    wishlist: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    activityLogs: [ActivityLogSchema], // Đã an toàn vì ActivityLogSchema đã khai báo ở trên
    googleId: String,
    email_Verified: Boolean,
    lastLoginAt: Date,
    metadata: Object,
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", UserSchema);