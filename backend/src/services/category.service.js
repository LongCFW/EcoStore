import Category from "../models/category.js";
import slugify from "slugify";
import Product from "../models/product.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Cấu hình đường dẫn tuyệt đối an toàn trong ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../../uploads");

// --- HELPER: Hàm xóa file ảnh ---
const deleteLocalImage = async (imageUrl) => {
    if (imageUrl && imageUrl.includes('/uploads/')) {
        try {
            // Cắt lấy tên file từ chuỗi URL (vd: /uploads/avatar-123.jpg -> avatar-123.jpg)
            const filename = imageUrl.split('/uploads/')[1];
            const filePath = path.join(UPLOADS_DIR, filename);
            await fs.unlink(filePath);
            console.log(`[CLEANUP] Đã xóa ảnh rác: ${filename}`);
        } catch (err) {
            console.error(`[LỖI] Không thể xóa ảnh (Có thể file không tồn tại): ${imageUrl}`, err.message);
        }
    }
};

// 1. Lấy danh sách (Hỗ trợ phân cấp)
export const getCategoriesService = async ({ page, limit, search, onlyActive }) => {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};

    if (onlyActive) {
        query.isActive = true;
    }

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
        .populate("parentId", "_id name slug") // Lấy thêm thông tin danh mục cha
        .limit(limit * 1)
        .skip(skip)
        .sort({ createdAt: -1 });

    const total = await Category.countDocuments(query);

    return {
        categories,
        totalPages: Math.ceil(total / limit),
        totalCategories: total
    };
};

// 2. Tạo mới
export const createCategoryService = async (data) => {
    const { name, description, imageUrl, isActive, parentId } = data; // Thêm parentId

    const exists = await Category.findOne({ name });
    if (exists) throw new Error("Tên danh mục đã tồn tại");

    const newCategory = await Category.create({
        name,
        description,
        imageUrl,
        parentId: parentId || null, // Lưu danh mục cha (nếu có)
        isActive: isActive === undefined ? true : isActive
    });

    return newCategory;
};

// 3. Cập nhật
export const updateCategoryService = async (id, data) => {
    const { name, description, imageUrl, isActive, parentId } = data; // Thêm parentId

    // Tìm danh mục cũ để check xem có thay ảnh mới không
    const oldCategory = await Category.findById(id);
    if (!oldCategory) throw new Error("Không tìm thấy danh mục");

    // Nếu có gửi ảnh mới lên, và ảnh đó khác ảnh cũ -> Xóa ảnh cũ đi cho nhẹ server
    if (imageUrl && oldCategory.imageUrl && imageUrl !== oldCategory.imageUrl) {
        await deleteLocalImage(oldCategory.imageUrl);
    }

    let updateData = { description, imageUrl, isActive, parentId: parentId || null };

    if (name && name !== oldCategory.name) {
        updateData.name = name;
        updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    return category;
};

// 4. Xóa (KIỂM TRA AN TOÀN TRƯỚC KHI XÓA)
export const deleteCategoryService = async (id) => {
    // Bước 1: Kiểm tra xem có Sản phẩm nào đang dùng danh mục này không?
    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
        throw new Error(`Không thể xóa! Đang có ${productCount} sản phẩm thuộc danh mục này.`);
    }

    // Bước 2: Kiểm tra xem có Danh mục con nào đang phụ thuộc không?
    const childCount = await Category.countDocuments({ parentId: id });
    if (childCount > 0) {
        throw new Error(`Không thể xóa! Đang có ${childCount} danh mục con phụ thuộc vào đây.`);
    }

    // Nếu an toàn, tiến hành tìm và xóa
    const category = await Category.findById(id);
    if (!category) throw new Error("Không tìm thấy danh mục");

    // Dọn rác: Xóa file ảnh vật lý
    await deleteLocalImage(category.imageUrl);

    // Xóa vĩnh viễn khỏi Database
    await Category.findByIdAndDelete(id);

    return category;
};