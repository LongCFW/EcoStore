// frontend/src/services/auth.service.js
import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  
  register: (data) => {
    // data bao gồm: name, email, password, phone
    return axiosClient.post('/auth/register', data);
  },

  // API giả định cho quên mật khẩu (Cần backend hỗ trợ sau này)
  verifyReset: (data) => {
      return axiosClient.post('/auth/verify-reset', data);
  },
  
  resetPassword: (data) => {
      return axiosClient.post('/auth/reset-password', data);
  }
};

export default authApi;