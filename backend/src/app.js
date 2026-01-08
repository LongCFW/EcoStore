// ==================== IMPORT LIBRARIES ====================
import express from "express";           // Web framework chính
import cors from "cors";                  // Middleware xử lý Cross-Origin Resource Sharing
import dotenv from "dotenv";              // Load biến môi trường từ file .env
import apiRoutes from "./routes/index.js"; // Routes chính của API

// ==================== IMPORT CONFIG ====================
import connectDB from "./config/db.js";   // Hàm kết nối database

// ==================== LOAD ENVIRONMENT VARIABLES ====================
dotenv.config();  // Đọc file .env và gán các biến vào process.env

// ==================== CREATE EXPRESS APP ====================
const app = express();  // Khởi tạo ứng dụng Express

// ==================== DATABASE CONNECTION ====================
connectDB();  // Kết nối tới MongoDB

// ==================== MIDDLEWARE CONFIGURATION ====================
// CORS: Cho phép request từ các domain khác
app.use(cors());

// JSON Parser: Chuyển đổi request body thành JSON
app.use(express.json());

// ==================== TEST ROUTE ====================
// Route kiểm tra server có đang chạy không
app.get("/", (req, res) => {
    res.json({ message: "EcoStore backend is running" });
});

// ==================== MOUNT API ROUTES ====================
// Tất cả routes API sẽ được mount tại /api
// Ví dụ: /api/auth, /api/products, /api/categories, v.v...
app.use("/api", apiRoutes);

// ==================== START SERVER ====================
const PORT = process.env.PORT || 5000;  // Lấy PORT từ .env hoặc dùng 5000 mặc định
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);  // Log thông báo server đã chạy
});

