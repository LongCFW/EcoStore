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
        .populate("categoryId", "name slug") // Lấy thêm tên và slug của danh mục để hiển thị cho đẹp
        .sort({ createdAt: -1 });
};