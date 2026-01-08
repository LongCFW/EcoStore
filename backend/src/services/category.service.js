import Category from "../models/category.js";

export const getAllCategoriesService = async () => {
    return await Category.find().sort({ createdAt: -1 });
};
