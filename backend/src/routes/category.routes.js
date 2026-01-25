import express from "express";
import { body } from "express-validator";
// 1. Import ĐÚNG tên các hàm từ controller
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory
} from "../controllers/category.controller.js";

// 2. Giữ nguyên các middleware cũ của bạn
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES (Ai cũng xem được) ---
// Route này giúp Frontend hiển thị filter danh mục
router.get("/", getCategories); 

// --- PROTECTED ROUTES (Chỉ Admin) ---

// 1. Tạo mới (Create) - Giữ nguyên logic validate của bạn
router.post(
    "/",
    authMiddleware,             
    requireRole(["admin"]),     
    [
        body("name").notEmpty().withMessage("Tên danh mục là bắt buộc")
    ],
    validateRequest,            
    createCategory              
);

// 2. Cập nhật (Update) - THÊM MỚI để trang quản lý hoạt động
router.put(
    "/:id",
    authMiddleware,
    requireRole(["admin"]),
    updateCategory
);

// 3. Xóa (Delete) - THÊM MỚI để trang quản lý hoạt động
router.delete(
    "/:id",
    authMiddleware,
    requireRole(["admin"]),
    deleteCategory
);

// (Route test cũ: Đã sửa lại dùng getCategories để không bị lỗi ReferenceError)
router.get(
  "/admin",
  authMiddleware,
  requireRole(["admin"]),
  getCategories // <--- Sửa getAllCategories thành getCategories
);

export default router;