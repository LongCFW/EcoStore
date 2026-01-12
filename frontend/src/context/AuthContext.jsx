import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Khởi tạo user từ localStorage nếu có (để F5 không bị mất login)
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Hàm login giả lập
  const login = (role) => {
    const userData = {
      id: 1,
      name: role === 'admin' ? 'Admin User' : (role === 'manager' ? 'Quản lý A' : 'Nhân viên B'),
      email: `${role}@ecostore.com`,
      role: role, 
      avatar: 'https://via.placeholder.com/150'
    };
    setUser(userData);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// dòng này để tắt cảnh báo của Vite eslint
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);