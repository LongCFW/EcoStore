import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/client/HomePage';
import LoginPage from '../pages/auth/LoginPage';
import ProductDetailPage from '../pages/client/ProductDetailPage'; // <--- Import mới

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        
        {/* Thêm route chi tiết sản phẩm ở đây. :id là tham số động */}
        <Route path="/product/:id" element={<ProductDetailPage />} /> 
        
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;