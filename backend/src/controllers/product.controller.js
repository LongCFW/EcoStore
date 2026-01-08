import {
    getAllProductsService,
    getProductBySlugService,
} from "../services/product.service.js";

export const getAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProductsService();

        res.json({
            success: true,
            data: products,
            message: "Get products successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getProductBySlug = async (req, res, next) => {
    try {
        const { slug } = req.params;

        const product = await getProductBySlugService(slug);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        res.json({
            success: true,
            data: product,
            message: "Get product detail successfully",
        });
    } catch (error) {
        next(error);
    }
};
