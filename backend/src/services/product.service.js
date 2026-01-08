import Product from "../models/product.js";

export const getAllProductsService = async () => {
    return await Product.find()
        .populate("categoryId")
        .sort({ createdAt: -1 });
};

export const getProductBySlugService = async (slug) => {
    return await Product.findOne({ slug }).populate("categoryId");
};
