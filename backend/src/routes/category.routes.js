import express from "express";
import { getAllCategories } from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

// PUBLIC
router.get("/", getAllCategories);

// PROTECTED – chỉ admin
router.get(
  "/admin",
  authMiddleware,
  requireRole(["admin"]),
  getAllCategories
);

export default router;
