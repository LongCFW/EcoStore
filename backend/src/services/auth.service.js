import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Role from "../models/role.js";
import Otp from "../models/otp.js"; // Import Model OTP
import sendEmail from "../utils/sendEmail.js";
import { otpTemplate } from "../utils/emailTemplates.js";

export const loginService = async (email, password) => {
    const user = await User.findOne({ email }).populate("role");
    if (!user) throw new Error("Invalid email or password");
    if (user.status === 0) throw new Error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = jwt.sign(
        { userId: user._id, role: user.role?.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        user: { id: user._id, email: user.email, name: user.name, phone: user.phone, role: user.role?.name, avatarUrl: user.avatarUrl }
    };
};

// --- HÀM MỚI: TẠO VÀ GỬI OTP ---
export const sendOtpService = async (email, type = 'register') => {
    const existingUser = await User.findOne({ email });
    
    // Kiểm tra logic theo ngữ cảnh
    if (type === 'register' && existingUser) throw new Error("Email already exists");
    if (type === 'reset' && !existingUser) throw new Error("Email không tồn tại trong hệ thống");

    // Tạo mã OTP 6 số ngẫu nhiên
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Dọn dẹp OTP cũ của email này để tránh spam
    await Otp.deleteMany({ email });

    // Lưu OTP mới vào DB
    await Otp.create({ email, otp: otpCode });

    // Gửi mail
    const subject = type === 'register' ? "Mã xác thực đăng ký EcoStore" : "Mã khôi phục mật khẩu EcoStore";
    await sendEmail({
        email: email,
        subject: subject,
        html: otpTemplate(otpCode, type)
    });

    return true;
};

// --- ĐĂNG KÝ BẮT BUỘC KÈM OTP ---
export const registerService = async (email, password, name, phone, otp) => {
    // 1. Kiểm tra mã OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");

    // 2. Tạo User
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("Email already exists");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const customerRole = await Role.findOne({ name: "customer" });
    if (!customerRole) throw new Error("Role 'customer' not found in database");

    const newUser = await User.create({
        email, password_hash: hashedPassword, name, phone,
        role: customerRole._id, 
        email_Verified: true // Đã qua bước OTP nên gán True luôn
    });

    // 3. Xóa OTP sau khi dùng thành công
    await Otp.deleteOne({ _id: validOtp._id });

    return { id: newUser._id, email: newUser.email, name: newUser.name, phone: newUser.phone, role: customerRole.name };
};

// --- XÁC MINH DANH TÍNH TRƯỚC KHI RESET MẬT KHẨU ---
export const verifyResetService = async (email, phone) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Email không tồn tại trong hệ thống");
    
    // Kiểm tra số điện thoại nếu cần (tùy chọn, có thể bỏ)
    // if (user.phone !== phone) throw new Error("Số điện thoại không khớp");
    
    return true;
};

// --- QUÊN MẬT KHẨU KÈM OTP ---
export const resetPasswordService = async (email, newPassword, otp) => {
    // 1. Kiểm tra OTP (Bỏ check Phone theo yêu cầu, chỉ check OTP email)
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");

    const user = await User.findOne({ email });
    if (!user) throw new Error("Người dùng không tồn tại");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password_hash = hashedPassword;
    await user.save();

    // Xóa OTP
    await Otp.deleteOne({ _id: validOtp._id });

    return true;
};