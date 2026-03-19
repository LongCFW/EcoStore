import express from "express";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import contactRoutes from "./contact.routes.js";

const router = express.Router();

router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/contact", contactRoutes);

export default router;
