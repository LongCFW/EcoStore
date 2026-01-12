import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';

const AdminLayout = () => {
  return (
    <div className="d-flex">
      {/* Sidebar cố định bên trái */}
      <AdminSidebar />

      {/* Nội dung chính bên phải */}
      <div className="flex-grow-1 bg-light" style={{ marginLeft: '250px', minHeight: '100vh' }}>
        {/* Header nhỏ của Admin (nếu cần) */}
        <header className="bg-white shadow-sm py-3 px-4 d-flex justify-content-between align-items-center">
            <h5 className="m-0 fw-bold text-secondary">Trang Quản Trị</h5>
            {/* Có thể thêm nút thông báo hoặc search ở đây */}
        </header>

        {/* Nơi hiển thị các trang con */}
        <main className="p-4">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;