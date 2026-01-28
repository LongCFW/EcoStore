import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import cartRoutes from "./routes/cart.routes.js";


// 1. CONFIGURATION
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. CONNECT DATABASE
connectDB();

// 3. GLOBAL MIDDLEWARES (Bộ lọc chung)
// Phải đặt trước Routes để xử lý dữ liệu đầu vào
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // URL chính xác của Frontend
    credentials: true // QUAN TRỌNG: Cho phép gửi/nhận cookie
}));
app.use(express.json()); // quan trọng: giúp server hiểu JSON từ client
app.use(cookieParser());

app.use((req, res, next) => {
    if (req.cookies && req.cookies.token && !req.headers.authorization) {
        req.headers.authorization = `Bearer ${req.cookies.token}`;
    }
    next();
});

// Cho phép truy cập ảnh từ bên ngoài
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Tùy cấu trúc thư mục

// 4. ROUTING (Đường đi)
// Test Route
app.get("/", (req, res) => {
  res.json({ message: "EcoStore backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);   
app.use("/api/orders", orderRoutes);

// API Routes
app.use("/api", apiRoutes);

// 5. ERROR HANDLING (Xử lý lỗi - Luôn nằm cuối)
// Middleware bắt lỗi 404 (Không tìm thấy route)
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});

// Middleware xử lý lỗi tập trung
app.use(errorHandler);

// 6. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});