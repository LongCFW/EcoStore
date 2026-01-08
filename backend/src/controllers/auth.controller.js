import { loginService, registerService } from "../services/auth.service.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginService(email, password);

        res.json({
            success: true,
            data: result,
            message: "Login successful"
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message
        });
    }
};

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        
        // Gọi đầu bếp (Service)
        const result = await registerService(email, password, name);

        // Trả về kết quả 201 Created
        res.status(201).json({
            success: true,
            data: result,
            message: "User registered successfully"
        });
    } catch (error) {
        // Nếu lỗi (ví dụ trùng email), chuyển cho Bác sĩ (Error Middleware)
        next(error); 
    }
};

