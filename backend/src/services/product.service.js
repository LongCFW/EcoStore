// src/services/product.service.js
import Product from "../models/product.js";
import Category from "../models/category.js"; // <--- Cần nhập kho Category để kiểm tra

export const createProductService = async (data) => {
    // 1. Kiểm tra Category có tồn tại không
    // Lưu ý: data.categoryId là cái frontend gửi lên
    const categoryExists = await Category.findById(data.categoryId);
    
    if (!categoryExists) {
        throw new Error("Category not found");
    }

    // 2. Nếu Category OK, thì mới tạo Product
    // Mongoose sẽ tự chạy hook tạo slug và sku như ta đã định nghĩa trong Model
    const newProduct = await Product.create(data);
    
    return newProduct;
};

// Chúng ta cũng cần hàm lấy danh sách sản phẩm để tí nữa test
export const getAllProductsService = async () => {
    return await Product.find()
        .populate("categoryId", "_id name slug") // Lấy thêm tên và slug của danh mục để hiển thị cho đẹp
        .sort({ createdAt: -1 });
};

export const getProductBySlugService = async (slug) => {
    // Tìm sản phẩm theo slug, populate category để lấy tên danh mục
    const product = await Product.findOne({ slug: slug })
        .populate("categoryId", "_id name slug");
        
    return product;
};

// Lấy sản phẩm liên quan
export const getRelatedProductsService = async (categoryId, currentProductId) => {
    return await Product.find({
        categoryId: categoryId,       // Cùng danh mục
        _id: { $ne: currentProductId } // Loại trừ ID hiện tại ($ne = not equal)
    })
    .limit(4) // Chỉ lấy 4 sản phẩm
    .populate("categoryId", "_id name slug"); // Populate để lấy thông tin đẹp
};

// --- UPDATE PRODUCT ---
export const updateProductService = async (id, data) => {
    // Tìm và update, trả về dữ liệu mới sau khi update
    const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
    if (!updatedProduct) throw new Error("Product not found");
    return updatedProduct;
};

// --- DELETE PRODUCT ---
export const deleteProductService = async (id) => {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) throw new Error("Product not found");
    return deletedProduct;
};