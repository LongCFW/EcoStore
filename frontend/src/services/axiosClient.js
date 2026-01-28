import axios from 'axios';

const axiosClient = axios.create({
  
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Quan trọng: Để gửi/nhận Cookie HttpOnly
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor Response (Xử lý kết quả trả về và lỗi)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data gọn gàng
    return response.data;
  },
  (error) => {
    // Xử lý lỗi chung
    if (error.response && error.response.status === 401) {
      console.error("Token hết hạn hoặc không hợp lệ. (Auto Logout logic here)");
      // Ví dụ: window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default axiosClient;