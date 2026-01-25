import { 
    getCategoriesService, 
    createCategoryService, 
    updateCategoryService, 
    deleteCategoryService 
} from "../services/category.service.js";

export const getCategories = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, search = "", is_active } = req.query;
        const result = await getCategoriesService({ page, limit, search,onlyActive: is_active === 'true'});
        res.json(result);
    } catch (error) {
        next(error);
    }
};

export const createCategory = async (req, res, next) => {
    try {
        // req.body chứa: name, description, imageUrl, isActive
        const category = await createCategoryService(req.body);
        res.status(201).json({ success: true, message: "Tạo danh mục thành công", category });
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const category = await updateCategoryService(req.params.id, req.body);
        res.json({ success: true, message: "Cập nhật thành công", category });
    } catch (error) {
        next(error);
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        await deleteCategoryService(req.params.id);
        res.json({ success: true, message: "Đã xóa danh mục" });
    } catch (error) {
        next(error);
    }
};