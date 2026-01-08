import { getAllCategoriesService, createCategoryService } from "../services/category.service.js";

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesService();

        res.json({
            success: true,
            data: categories,
            message: "Get categories successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        const { name, description, parentId, imageUrl } = req.body;

        // Gọi service xử lý
        const category = await createCategoryService({ 
            name, description, parentId, imageUrl 
        });

        res.status(201).json({
            success: true,
            data: category,
            message: "Category created successfully",
        });
    } catch (error) {
        // --- ĐÂY LÀ CHỖ FIX LỖI STATUS CODE ---
        // Nếu lỗi là do trùng lặp (Service ném ra), ta gán code 400
        if (error.message === "Category name already exists") {
            error.statusCode = 400; 
        }
        
        next(error); // Chuyền cho "Bác sĩ" xử lý tiếp
    }
};
