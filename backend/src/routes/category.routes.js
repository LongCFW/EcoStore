import express from "express";
import { body } from "express-validator";
import { 
    getCategories, 
    createCategory, 
    updateCategory, 
    deleteCategory
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", getCategories); 

// --- PROTECTED ROUTES (Admin & Manager) ---

// 1. Tạo mới
router.post(
    "/",
    authMiddleware,            
    requireRole(["admin", "manager"]), // Cho phép cả Manager
    [
        body("name").notEmpty().withMessage("Tên danh mục là bắt buộc")
    ],
    validateRequest,            
    createCategory              
);

// 2. Cập nhật
router.put(
    "/:id",
    authMiddleware,
    requireRole(["admin", "manager"]),
    updateCategory
);

// 3. Xóa
router.delete(
    "/:id",
    authMiddleware,
    requireRole(["admin", "manager"]),
    deleteCategory
);

// Route lấy danh sách cho trang admin (thực ra dùng chung getCategories cũng được)
router.get(
  "/admin",
  authMiddleware,
  requireRole(["admin", "manager"]),
  getCategories
);

export default router;