import Category from "../models/category.js";

export const getAllCategoriesService = async () => {
    // Populate parentId để nếu là danh mục con thì hiện luôn thông tin cha
    return await Category.find().populate("parentId", "name").sort({ createdAt: -1 });
};

// --- THÊM MỚI ---
export const createCategoryService = async (data) => {
    // data sẽ bao gồm: name, description, parentId...
    
    // Kiểm tra trùng tên (Model đã unique, nhưng check ở đây để báo lỗi rõ hơn)
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
        throw new Error("Category name already exists");
    }

    const newCategory = await Category.create(data);
    return newCategory;
};