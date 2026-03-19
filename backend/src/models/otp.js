import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
    email: { type: String, required: true },
    otp: { type: String, required: true },
    // Tự động xóa document này sau 300 giây (5 phút)
    createdAt: { type: Date, default: Date.now, expires: 300 } 
});

export default mongoose.model("Otp", OtpSchema);