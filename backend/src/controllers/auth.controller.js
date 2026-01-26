import { loginService, registerService, verifyResetService, resetPasswordService } from "../services/auth.service.js";
import User from "../models/user.js";
import bcrypt from "bcrypt";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);
        res.cookie("token", result.token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000 // 1 ngày
        });
        res.status(200).json({
            success: true,
            data: result,
            message: "Login successful"
        });
    } catch (error) {
        // Nếu lỗi là do sai pass/email
        if (error.message === "Invalid email or password") {
            error.statusCode = 401; // Unauthorized
        }
        next(error);
    }
};

export const register = async (req, res, next) => {
    try {
        const { email, password, name, phone } = req.body;
        
        const result = await registerService(email, password, name, phone);

        res.status(201).json({
            success: true,
            data: result,
            message: "User registered successfully"
        });
    } catch (error) {
        // Xử lý lỗi trùng email
        if (error.message === "Email already exists") {
            error.statusCode = 409; // 409 Conflict: Dữ liệu đã tồn tại
        }
        next(error); 
    }
};

// --- API: Xác minh Reset ---
export const verifyReset = async (req, res, next) => {
    try {
        const { email, phone } = req.body;
        await verifyResetService(email, phone);
        res.status(200).json({ success: true, message: "Identity verified" });
    } catch (error) {
        error.statusCode = 400; // Bad request
        next(error);
    }
};

// --- API: Đổi mật khẩu ---
export const resetPassword = async (req, res, next) => {
    try {
        const { email, phone, newPassword } = req.body;
        await resetPasswordService(email, phone, newPassword);
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        error.statusCode = 400;
        next(error);
    }
};

export const updateAvatar = async (req, res) => {
    try {
        console.log("--- BẮT ĐẦU UPLOAD ---");

        // 1. Check File
        if (!req.file) {
            console.log("Lỗi: Không có file gửi lên");
            return res.status(400).json({ message: "Vui lòng chọn ảnh" });
        }
        console.log("1. File đã nhận:", req.file.filename);

        // 2. Check User ID từ Token
        console.log("2. User Token Payload:", req.user); // In ra để xem token chứa gì
        
        // Kiểm tra xem userId có tồn tại không. 
        // Lưu ý: Token cũ có thể lưu là 'id', token mới là 'userId'. Check cả 2.
        const userId = req.user.userId || req.user.id; 
        
        if (!userId) {
            console.log("Lỗi: Không tìm thấy ID trong token");
            return res.status(401).json({ message: "Token không hợp lệ (Thiếu ID)" });
        }
        console.log("3. User ID cần update:", userId);

        // 3. Tạo URL
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        const avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;
        console.log("4. Link ảnh mới:", avatarUrl);

        // 4. Update DB
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { avatarUrl: avatarUrl },
            { new: true }
        );

        if (!updatedUser) {
            console.log("Lỗi: Không tìm thấy User trong DB với ID:", userId);
            return res.status(404).json({ message: "User không tồn tại trong DB" });
        }

        console.log("5. Update thành công. User mới:", updatedUser.avatarUrl);
        console.log("--- KẾT THÚC ---");

        res.json({ 
            success: true, 
            message: "Upload thành công",
            avatarUrl: updatedUser.avatarUrl 
        });

    } catch (error) {
        // ĐÂY LÀ CHỖ QUAN TRỌNG NHẤT
        console.error("❌ LỖI NGHIÊM TRỌNG:", error); // Nó sẽ in lỗi đỏ lòm ra terminal
        res.status(500).json({ message: error.message });
    }
};


// --- HÀM 1: CẬP NHẬT THÔNG TIN (Tên, SĐT) ---
export const updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { name, phone } = req.body;

        // Tìm và update
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, phone },
            { new: true } // Trả về data mới
        ).select("-password_hash"); // Không trả về mật khẩu

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            message: "Cập nhật thông tin thành công",
            user: {
                name: updatedUser.name,
                phone: updatedUser.phone,
                // Trả về các field khác để frontend đồng bộ nếu cần
                email: updatedUser.email,
                role: req.user.role, 
                avatarUrl: updatedUser.avatarUrl
            }
        });
    } catch (error) {
        next(error);
    }
};

// --- HÀM 2: ĐỔI MẬT KHẨU ---
export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { currentPassword, newPassword } = req.body;

        // 1. Tìm user để lấy mật khẩu cũ
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // 2. Kiểm tra mật khẩu hiện tại có đúng không
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
        }

        // 3. Mã hóa mật khẩu mới
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // 4. Lưu vào DB
        user.password_hash = hashedPassword;
        await user.save();

        res.json({ success: true, message: "Đổi mật khẩu thành công" });
    } catch (error) {
        next(error);
    }
};

export const getMe = async (req, res, next) => {
    try {
        // req.user được tạo ra từ middleware verifyToken
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await User.findById(req.user.userId).populate('role', 'name');
        
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};