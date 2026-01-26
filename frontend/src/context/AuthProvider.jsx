import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext'; 
import userApi from '../services/user.service'; // Đảm bảo đã có file này

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Hàm Logout (Gọi API logout nếu cần, hoặc chỉ xóa state)
  const logout = useCallback(() => {
    // Xóa user trong state
    setUser(null);
    localStorage.removeItem('currentUser'); // Xóa cache thông tin user (nếu có)
    
    // Nếu backend có API logout để xóa cookie server, hãy gọi ở đây
    // userApi.logout(); 
    
    // Điều hướng về login
    navigate('/login');
  }, [navigate]);

  // 2. Hàm Login (Chỉ lưu thông tin user vào state/localStorage, Token đã nằm trong Cookie HttpOnly)
  const login = useCallback((userData) => {
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // 3. Check Auth bằng cách gọi API /me
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await userApi.getProfile();
        
        if (res.success) {
          const userData = res.data;
          
          // Nếu role là object (do populate), ta chỉ lấy tên role (vd: "admin")
          // Để toàn bộ ứng dụng chỉ việc xài chuỗi string, không bị lỗi object
          if (userData.role && typeof userData.role === 'object') {
              userData.role = userData.role.name; 
          }
          // --------------------------------

          setUser(userData);
          localStorage.setItem('currentUser', JSON.stringify(userData));
        } else {
          throw new Error("Xác thực thất bại");
        }
      } catch {
        console.log("User chưa đăng nhập hoặc phiên hết hạn.");
        setUser(null);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const updateUser = useCallback((updatedData) => {
      setUser((prevUser) => {
          if (!prevUser) return null;
          const newUser = { ...prevUser, ...updatedData };
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          return newUser;
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};