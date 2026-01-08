import { getAllCategoriesService, createCategoryService } from "../services/category.service.js";

export const getAllCategories = async (req, res, next) => {
    try {
        const categories = await getAllCategoriesService();

        res.status(200).json({
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
        // Xử lý lỗi trùng lặp từ Service hoặc Mongoose (Code 11000)
        if (error.message === "Category name already exists" || error.code === 11000) {
            error.statusCode = 400; // Bad Request
            error.message = "Category name already exists"; // Đảm bảo thông báo lỗi dễ hiểu
        }
        
        next(error); // Chuyền lỗi cho Error Middleware xử lý
    }
};