// frontend/src/services/product.service.js
import axiosClient from './axiosClient';

const productApi = {
  // Lấy tất cả sản phẩm
  getAll: () => {
    return axiosClient.get('/products'); 
    // Nó sẽ nối với baseURL thành: http://localhost:5000/api/products
  },

  // Lấy chi tiết (dùng sau này)
  getBySlug: (slug) => {
    return axiosClient.get(`/products/${slug}`);
  },

  // lấy sản phẩm gần đây
  getRelated: (categoryId, currentProductId) => {
    return axiosClient.get(`/products/related?categoryId=${categoryId}&currentProductId=${currentProductId}`);
  }
};

export default productApi;