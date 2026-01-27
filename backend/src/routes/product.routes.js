import express from "express";
import {
    getAllProducts,
    getProductBySlug,
    getRelatedProducts,
    updateProduct,
    deleteProduct,
    createProduct
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", getAllProducts);
router.get("/related", getRelatedProducts);
router.get("/:slug", getProductBySlug);

// --- PROTECTED ROUTES (Admin & Manager) ---
// Yêu cầu: Chỉ Admin và Manager được phép thao tác

// 1. Xem danh sách dạng bảng (cho trang Admin)
router.get(
    "/admin/all",
    authMiddleware,
    requireRole(["admin", "manager"]), 
    getAllProducts
);

// 2. Tạo sản phẩm
router.post(
  "/", 
  authMiddleware,
  requireRole(["admin", "manager"]), 
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("price_cents").isNumeric().withMessage("Price must be a number"),
  ],
  validateRequest,
  createProduct
);

// 3. Sửa sản phẩm
router.put(
    "/:id",
    authMiddleware,
    requireRole(["admin", "manager"]),
    validateRequest,
    updateProduct
);

// 4. Xóa sản phẩm
router.delete(
    "/:id",
    authMiddleware,
    requireRole(["admin", "manager"]), 
    deleteProduct
);

export default router;