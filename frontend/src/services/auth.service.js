import axiosClient from './axiosClient';

const authApi = {
  login: (data) => {
    return axiosClient.post('/auth/login', data);
  },
  
  logout: () => {
    return axiosClient.post('/auth/logout');
  },
  
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  sendOtp: (data) => {
    return axiosClient.post('/auth/send-otp', data);
  },
  
  resetPassword: (data) => {
      return axiosClient.post('/auth/reset-password', data);
  }
};

export default authApi;