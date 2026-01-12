import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { AdminThemeProvider } from '../context/AdminThemeProvider';
import '../assets/styles/admin.css'; // Import CSS Admin

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    // Bọc toàn bộ layout trong Provider để dùng được Theme
    <AdminThemeProvider>
        <div className="admin-layout">
            {/* Sidebar */}
            <AdminSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

            {/* Main Content Area */}
            <div className="admin-main">
                {/* Header */}
                <AdminHeader toggleSidebar={toggleSidebar} />

                {/* Content Pages */}
                <main className="admin-content">
                    <Outlet />
                </main>
            </div>
        </div>
    </AdminThemeProvider>
  );
};

export default AdminLayout;