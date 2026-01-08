// src/middlewares/validate.middleware.js
import { validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
    // 1. Lấy kết quả kiểm tra từ express-validator
    const errors = validationResult(req);

    // 2. Nếu có lỗi
    if (!errors.isEmpty()) {
        // Trả về lỗi 400 (Bad Request) cùng danh sách lỗi
        return res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: errors.array() // Liệt kê chi tiết lỗi (ví dụ: email sai, pass ngắn...)
        });
    }

    // 3. Nếu không có lỗi, cho qua (Next)
    next();
};