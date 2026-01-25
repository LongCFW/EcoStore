import Category from "../models/category.js";
import slugify from "slugify";

// 1. Lấy danh sách
export const getCategoriesService = async ({ page, limit, search }) => {
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    
    // Pagination
    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
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
    const { name, description, imageUrl, isActive } = data;

    // Check trùng tên
    const exists = await Category.findOne({ name });
    if (exists) {
        throw new Error("Tên danh mục đã tồn tại");
    }

    // Slug sẽ tự tạo nhờ middleware pre('save') trong Model của bạn
    const newCategory = await Category.create({ 
        name, 
        description, 
        imageUrl, 
        isActive: isActive === undefined ? true : isActive // Default true nếu ko truyền
    });

    return newCategory;
};

// 3. Cập nhật
export const updateCategoryService = async (id, data) => {
    const { name, description, imageUrl, isActive } = data;
    
    // Nếu update name thì cần update slug -> Model middleware chỉ chạy khi save(), 
    // updateOne/findByIdAndUpdate thường ko chạy middleware trừ khi config.
    // Cách an toàn nhất: Update slug thủ công nếu name đổi
    let updateData = { description, imageUrl, isActive };
    
    if (name) {
        updateData.name = name;
        updateData.slug = slugify(name, { lower: true, strict: true });
    }

    const category = await Category.findByIdAndUpdate(id, updateData, { new: true });
    if (!category) throw new Error("Không tìm thấy danh mục");
    
    return category;
};

// 4. Xóa
export const deleteCategoryService = async (id) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new Error("Không tìm thấy danh mục");
    return category;
};