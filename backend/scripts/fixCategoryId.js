import mongoose from "mongoose";
import Product from "../src/models/product.js";

async function fixCategoryId() {
  await mongoose.connect("mongodb://localhost:27017/ecostore");

  const products = await Product.find({});
  let fixedCount = 0;

  for (const product of products) {
    if (typeof product.categoryId === "string") {
      product.categoryId = new mongoose.Types.ObjectId(product.categoryId);
      await product.save();
      fixedCount++;
    }
  }

  console.log(`✅ Fixed ${fixedCount} products`);
  process.exit();
}

fixCategoryId();
