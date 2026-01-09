import express from "express";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import authRoutes from "./auth.routes.js";
import cartRoutes from "./cart.routes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/auth", authRoutes);
router.use("/cart", cartRoutes);

export default router;
