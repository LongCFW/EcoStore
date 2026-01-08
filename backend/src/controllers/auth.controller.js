import { loginService, registerService } from "../services/auth.service.js";

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
        const { email, password, name } = req.body;
        
        const result = await registerService(email, password, name);

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