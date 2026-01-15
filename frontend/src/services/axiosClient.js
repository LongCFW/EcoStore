// frontend/src/services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Đọc từ file .env
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(async (config) => {
    // Lấy token từ localStorage (hoặc nơi bạn lưu token khi đăng nhập)
    const token = localStorage.getItem('token'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor (Bộ đón): Xử lý dữ liệu trước khi trả về cho Component
axiosClient.interceptors.response.use(
  (response) => {
    // Backend thường trả về dạng { message: "...", data: [...] } hoặc trực tiếp [...]
    // Dòng này giúp lấy thẳng phần data, bớt code ở component
    return response.data; 
  },
  (error) => {
    // Nơi xử lý lỗi chung (VD: Hết hạn token thì logout)
    if (error.response) {
        console.error("API Error:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default axiosClient;