// frontend/src/services/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Đọc từ file .env
  headers: {
    'Content-Type': 'application/json',
  },
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
    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;