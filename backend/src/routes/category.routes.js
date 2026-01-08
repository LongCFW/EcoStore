// src/routes/category.routes.js
import express from "express";
import { body } from "express-validator";
import { 
    getAllCategories, 
    createCategory // <--- Import controller mới
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getAllCategories);

// PROTECTED ROUTES (Chỉ Admin)
router.post(
    "/",
    authMiddleware,             // 1. Kiểm tra đăng nhập
    requireRole(["admin"]),     // 2. Chỉ cho phép role 'admin'
    [
        // 3. Validation: Tên là bắt buộc
        body("name").notEmpty().withMessage("Category name is required")
    ],
    validateRequest,            // 4. Gom lỗi validation (nếu có)
    createCategory              // 5. Vào controller xử lý
);

// (Route cũ /admin test quyền vẫn giữ hoặc xóa tùy bạn)
router.get(
  "/admin",
  authMiddleware,
  requireRole(["admin"]),
  getAllCategories
);

export default router;