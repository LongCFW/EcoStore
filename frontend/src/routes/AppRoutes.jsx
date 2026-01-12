import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/client/HomePage";
import LoginPage from "../pages/auth/LoginPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes - Dùng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        {/* Sau này thêm Product, Cart vào đây */}
      </Route>

      {/* Auth Routes - Không dùng MainLayout hoặc dùng AuthLayout riêng */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes - Sau này sẽ thêm AdminLayout vào đây */}
    </Routes>
  );
};

export default AppRoutes;
