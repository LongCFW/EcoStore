import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout'; 

import HomePage from '../pages/client/HomePage';
import ProductDetailPage from '../pages/client/ProductDetailPage';
import CartPage from '../pages/client/CartPage';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage'; 
import UserProfilePage from '../pages/client/UserProfilePage';
import ProductListPage from '../pages/client/ProductListPage'; 
import CheckoutPage from '../pages/client/CheckoutPage';
import AboutPage from '../pages/client/AboutPage';
import OffersPage from '../pages/client/OffersPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Client Routes - Dùng MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/products" element={<ProductListPage />} /> 
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/offers" element={<OffersPage />} />
      </Route>

      {/* Auth Routes - Dùng AuthLayout */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

    </Routes>
  );
};

export default AppRoutes;