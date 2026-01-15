import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  // Helper xóa data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('currentUser');
  }, []);

  // 1. KHỞI TẠO STATE (Xử lý token hết hạn ngay tại đây)
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const storedUser = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    
    if (token && storedUser) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          // Token hết hạn -> Xóa storage ngay lập tức
          localStorage.removeItem('token'); localStorage.removeItem('currentUser');
          sessionStorage.removeItem('token'); sessionStorage.removeItem('currentUser');
          return null;
        }
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('token'); localStorage.removeItem('currentUser');
        sessionStorage.removeItem('token'); sessionStorage.removeItem('currentUser');
        return null;
      }
    }
    return null;
  });

  // 2. Hàm Logout
  const logout = useCallback(() => {
    setUser(null);
    clearAuthData();
    navigate('/login');
  }, [navigate, clearAuthData]);

  // 3. Hàm Login
  const login = (userData, token, remember = false) => {
    if (remember) {
      localStorage.setItem('token', token);
      localStorage.setItem('currentUser', JSON.stringify(userData));
    } else {
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }
    setUser(userData);
  };

  // 4. useEffect: CHỈ ĐẶT TIMER NẾU TOKEN CÒN HẠN
  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const timeLeft = decoded.exp * 1000 - Date.now();
        
        // CHỈ làm việc khi token CÒN HẠN (timeLeft > 0)
        if (timeLeft > 0) {
          const timer = setTimeout(() => {
            logout();
            alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          }, timeLeft);
          return () => clearTimeout(timer);
        }
        // NẾU HẾT HẠN (timeLeft <= 0): KHÔNG LÀM GÌ CẢ
        // Vì logic khởi tạo state (useState) ở trên đã xử lý user = null rồi.
        
      } catch {
        // Token lỗi -> cũng không cần logout ở đây để tránh loop, 
        // lần F5 tiếp theo sẽ tự clean.
      }
    }
  }, [logout]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);