import Product from "../models/product.js";
import Category from "../models/category.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import Order from "../models/order.js";
import Cart from "../models/cart.js";

// Cấu hình đường dẫn giống bên Category
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const deleteLocalImage = async (imageUrl) => {
    if (imageUrl && imageUrl.includes('/uploads/')) {
        try {
            const filename = imageUrl.split('/uploads/')[1];
            const filePath = path.join(UPLOADS_DIR, filename);
            await fs.unlink(filePath);
            console.log(`[CLEANUP] Đã xóa ảnh rác: ${filename}`);
        } catch (err) {
            console.error(`[LỖI] Không thể xóa ảnh: ${imageUrl}`, err.message);
        }
    }
};

export const createProductService = async (data) => {
    const categoryExists = await Category.findById(data.categoryId);
    if (!categoryExists) throw new Error("Category not found");

    const newProduct = await Product.create(data);
    return newProduct;
};

export const getAllProductsService = async () => {
    const hiddenCategories = await Category.find({ isActive: false }).select('_id');
    const hiddenIds = hiddenCategories.map(c => c._id);

    const query = {};
    if (hiddenIds.length > 0) {
        query.categoryId = { $nin: hiddenIds };
    }

    return await Product.find(query)
        .populate("categoryId", "_id name slug")
        .sort({ createdAt: -1 });
};

export const getProductBySlugService = async (slug) => {
    return await Product.findOne({ slug: slug })
        .populate("categoryId", "_id name slug");
};

export const getRelatedProductsService = async (categoryId, currentProductId) => {
    return await Product.find({
        categoryId: categoryId,
        _id: { $ne: currentProductId }
    })
        .limit(4)
        .populate("categoryId", "_id name slug");
};

// --- UPDATE PRODUCT ---
export const updateProductService = async (id, data) => {
    const oldProduct = await Product.findById(id);
    if (!oldProduct) throw new Error("Product not found");

    // Xóa ảnh cũ nếu update mảng ảnh mới hoàn toàn khác (Logic phức tạp hơn một chút)
    // Để đơn giản và an toàn nhất, tạm thời ta cập nhật data, chuyện so sánh mảng ảnh 
    // có thể xử lý chuyên sâu ở API upload ảnh riêng biệt sau này.
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    return updatedProduct;
};

// --- DELETE PRODUCT (HARD DELETE AN TOÀN) ---
export const deleteProductService = async (id) => {
    // 1. KIỂM TRA RÀNG BUỘC (SAFE DELETE)
    // Kiểm tra trong Đơn hàng
    const orderExists = await Order.findOne({ "items.productId": id });
    if (orderExists) {
        throw new Error("Không thể xóa! Sản phẩm này đã tồn tại trong lịch sử đơn hàng.");
    }

    // Kiểm tra trong Giỏ hàng của khách (Tùy chọn: Bạn có thể bỏ qua bước này nếu muốn ép xóa khỏi giỏ)
    const cartExists = await Cart.findOne({ "items.productId": id });
    if (cartExists) {
        throw new Error("Không thể xóa! Sản phẩm đang nằm trong giỏ hàng của khách.");
    }

    // 2. Tìm và tiến hành dọn rác
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");

    // Dọn rác ảnh vật lý
    if (product.images && product.images.length > 0) {
        for (const img of product.images) {
            await deleteLocalImage(img.imageUrl);
        }
    }

    // 3. Xóa vĩnh viễn
    await Product.findByIdAndDelete(id);
    
    return product;
};