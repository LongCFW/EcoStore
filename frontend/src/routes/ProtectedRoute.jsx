import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Component này nhận vào allowedRoles (mảng các quyền được phép)
const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Chưa đăng nhập -> Đá về trang login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Có đăng nhập nhưng không đúng quyền -> Đá về trang "Không có quyền" hoặc Home
  // Nếu allowedRoles rỗng thì ai logged in cũng vào được
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    alert("Bạn không có quyền truy cập trang này!");
    return <Navigate to="/admin" replace />; // Hoặc trang 403
  }

  // 3. Hợp lệ -> Cho hiện nội dung
  return <Outlet />;
};

export default ProtectedRoute;