import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// 1. CONFIGURATION
dotenv.config();
const app = express();

// 2. CONNECT DATABASE
connectDB();

// 3. GLOBAL MIDDLEWARES (Bộ lọc chung)
// Phải đặt trước Routes để xử lý dữ liệu đầu vào
app.use(cors());
app.use(express.json()); // quan trọng: giúp server hiểu JSON từ client

// 4. ROUTING (Đường đi)
// Test Route
app.get("/", (req, res) => {
  res.json({ message: "EcoStore backend is running" });
});

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