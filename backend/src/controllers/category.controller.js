import { getAllCategoriesService } from "../services/category.service.js";

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
