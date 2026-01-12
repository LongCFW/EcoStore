import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  // Trả về Outlet nguyên bản để LoginPage/RegisterPage tự quyền kiểm soát toàn màn hình
  // Không bọc thêm Container hay Card nào cả
  return <Outlet />;
};

export default AuthLayout;