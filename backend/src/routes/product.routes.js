import express from "express";
import {
    getAllProducts,
    getProductBySlug,
} from "../controllers/product.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:slug
router.get("/:slug", getProductBySlug);

// PROTECTED (admin only) — READ
router.get(
    "/admin/all",
    authMiddleware,
    requireRole(["admin"]),
    getAllProducts
);
export default router;
