import express from "express";
import {
    getAllProducts,
    getProductBySlug,
    getRelatedProducts,
    updateProduct,
    deleteProduct
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";
import { body } from "express-validator";
import { createProduct } from "../controllers/product.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";

const router = express.Router();

// GET /api/products
router.get("/", getAllProducts);
// GET /api/products/related?categoryId=...&currentProductId=...
router.get("/related", getRelatedProducts);
// GET /api/products/:slug
router.get("/:slug", getProductBySlug);

// PROTECTED (admin only) — READ
router.get(
    "/admin/all",
    authMiddleware,
    requireRole(["admin"]),
    getAllProducts
);

// Route Tạo sản phẩm (Chỉ Admin)
router.post(
  "/", // Đường dẫn gốc của products
  authMiddleware,
  requireRole(["admin"]),
  [
    // Validation cơ bản
    body("name").notEmpty().withMessage("Name is required"),
    body("categoryId").notEmpty().withMessage("Category ID is required"),
    body("price_cents").isNumeric().withMessage("Price must be a number"),
  ],
  validateRequest,
  createProduct
);

// PUT /api/products/:id (Sửa)
router.put(
    "/:id",
    authMiddleware,
    requireRole(["admin"]),
    validateRequest, // Có thể thêm body validation nếu cần
    updateProduct
);

// DELETE /api/products/:id (Xóa)
router.delete(
    "/:id",
    authMiddleware,
    requireRole(["admin"]),
    deleteProduct
);
export default router;
