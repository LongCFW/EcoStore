import { loginService, registerService, verifyResetService, resetPasswordService } from "../services/auth.service.js";

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

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