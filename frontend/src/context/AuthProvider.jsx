// src/context/AuthProvider.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from './AuthContext'; 

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Hàm Logout
  const logout = useCallback(() => {
    Cookies.remove('token');
    localStorage.removeItem('currentUser');
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // 2. Hàm Login
  const login = useCallback((userData, token, remember = false) => {
    const cookieOptions = { secure: false };
    if (remember) {
        cookieOptions.expires = 7; 
    }
    Cookies.set('token', token, cookieOptions);
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  }, []);

  // 3. Check Auth khi F5
  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      const storedUser = localStorage.getItem('currentUser');

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {        
        console.error("Invalid token:", error); 
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [logout]);

  // Hàm này giúp cập nhật thông tin user ngay lập tức (cho Avatar, Tên, v.v.)
  const updateUser = useCallback((updatedData) => {
      setUser((prevUser) => {
          if (!prevUser) return null;
          
          const newUser = { ...prevUser, ...updatedData };
          
          // Cập nhật cả LocalStorage để khi F5 không bị mất dữ liệu mới
          localStorage.setItem('currentUser', JSON.stringify(newUser));
          
          return newUser;
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser,loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};