import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Role from "../models/role.js";


export const loginService = async (email, password) => {
    const user = await User.findOne({ email }).populate("role");

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user._id,
            role: user.role?.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return {
        token,
        user: {
            id: user._id,
            email: user.email,
            name: user.name,
            role: user.role?.name
        }
    };
};

export const registerService = async (email, password, name, phone) => {
    // 1. Kiểm tra xem email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("Email already exists");
    }

    // 2. Mã hóa mật khẩu (Hashing)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. Lấy role mặc định là "customer" để gán cho người dùng mới
    const customerRole = await Role.findOne({ name: "customer" });
    if (!customerRole) {
        throw new Error("Role 'customer' not found in database");
    }

    // 4. Tạo user mới và lưu vào DB
    const newUser = await User.create({
        email,
        password_hash: hashedPassword,
        name,
        phone,
        role: customerRole._id,
        email_Verified: false // Mới tạo thì chưa verify email
    });

    return {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        role: "customer"
    };
};

// --- API MỚI: Kiểm tra Email & SĐT ---
export const verifyResetService = async (email, phone) => {
    const user = await User.findOne({ email, phone });
    if (!user) {
        throw new Error("Thông tin xác thực không đúng");
    }
    return true; // Tìm thấy user
};

// --- API MỚI: Đặt lại mật khẩu ---
export const resetPasswordService = async (email, phone, newPassword) => {
    const user = await User.findOne({ email, phone });
    if (!user) {
        throw new Error("Người dùng không tồn tại");
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password_hash = hashedPassword;
    await user.save();

    return true;
};