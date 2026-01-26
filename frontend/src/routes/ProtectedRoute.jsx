import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    // 1. Đợi tải xong thông tin User
    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                <Spinner animation="border" variant="success" />
            </div>
        );
    }

    // 2. Nếu chưa đăng nhập -> Đá về Login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // API /me trả về role là Object ({name: 'admin'}), còn Login trả về String ('admin')
    // lấy ra chuỗi tên role chuẩn xác.
    const userRole = user.role && typeof user.role === 'object' ? user.role.name : user.role;
    // --------------------------------------------

    // 3. Kiểm tra quyền
    if (allowedRoles && !allowedRoles.includes(userRole)) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center animate-fade-in">
                <h1 className="text-danger fw-bold display-1">403</h1>
                <h4 className="mb-3">Truy cập bị từ chối</h4>
                <p className="text-muted mb-4">
                    Tài khoản <strong>{user.email}</strong> (Quyền: {userRole}) <br/>
                    không được phép truy cập trang này.
                </p>
                <a href="/" className="btn btn-outline-primary rounded-pill px-4">Về trang chủ</a>
            </div>
        );
    }

    // 4. Hợp lệ -> Cho vào
    return <Outlet />;
};

export default ProtectedRoute;