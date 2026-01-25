import axios from 'axios';
import Cookies from 'js-cookie';

const axiosClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// INTERCEPTOR REQUEST: Gắn Token từ Cookie vào Header
axiosClient.interceptors.request.use(async (config) => {
  const token = Cookies.get('token'); // <--- Lấy từ Cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// INTERCEPTOR RESPONSE
axiosClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Nếu lỗi 401 (Unauthorized) -> Có thể do Token hết hạn
    if (error.response && error.response.status === 401) {
      // Có thể xử lý logout tự động ở đây nếu muốn
      console.error("Token hết hạn hoặc không hợp lệ.");
    }
    return Promise.reject(error);
  }
);

export default axiosClient;