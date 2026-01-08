// src/middlewares/error.middleware.js

export const errorHandler = (err, req, res, next) => {
    // 1. Log lỗi ra console để dev biết đường sửa
    console.error("❌ Error:", err.stack);

    // 2. Xác định status code (mặc định là 500 - Lỗi server)
    const statusCode = err.statusCode || 500;
    
    // 3. Thông điệp lỗi
    const message = err.message || "Internal Server Error";

    // 4. Trả về JSON chuẩn format
    res.status(statusCode).json({
        success: false,
        message: message,
        // Chỉ hiện chi tiết lỗi (stack) khi đang dev, không hiện khi production (để bảo mật)
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};