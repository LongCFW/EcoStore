import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';
import { 
    FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, 
    FaChartBar, FaSignOutAlt, FaCogs , FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext'; // Import hook lấy user

const AdminSidebar = () => {
  const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout

  // Định nghĩa menu và quyền được phép thấy
  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, roles: ['admin', 'manager', 'staff'] },
    { path: '/admin/products', label: 'Quản lý Sản phẩm', icon: <FaBox />, roles: ['admin', 'manager'] },
    { path: '/admin/orders', label: 'Quản lý Đơn hàng', icon: <FaShoppingBag />, roles: ['admin', 'manager', 'staff'] },
    { path: '/admin/customers', label: 'Khách hàng', icon: <FaUsers />, roles: ['admin', 'manager'] },
    { path: '/admin/stats', label: 'Thống kê', icon: <FaChartBar />, roles: ['admin'] },
    { path: '/admin/settings', label: 'Cấu hình', icon: <FaCogs />, roles: ['admin'] },
    { path: '/admin/logs', label: 'Nhật ký hệ thống', icon: <FaShieldAlt />, roles: ['admin'] }
  ];

  return (
    <div className="bg-dark text-white d-flex flex-column p-3 vh-100 position-fixed" style={{width: '250px', zIndex: 1000}}>
      <Link to="/admin" className="text-decoration-none text-white mb-4">
        <h3 className="fw-bold text-success">EcoAdmin</h3>
      </Link>
      
      <Nav className="flex-column gap-2 flex-grow-1">
        {menuItems.map((item, index) => {
            // Kiểm tra: Nếu role của user nằm trong danh sách được phép thì mới render
            if (user && item.roles.includes(user.role)) {
                return (
                    <Nav.Item key={index}>
                        <Nav.Link as={NavLink} to={item.path} end className="text-white d-flex align-items-center gap-2">
                            {item.icon} {item.label}
                        </Nav.Link>
                    </Nav.Item>
                );
            }
            return null;
        })}
      </Nav>

      <div className="mt-auto border-top pt-3">
         <div className="d-flex align-items-center gap-2 mb-3">
            <img src={user?.avatar || "https://via.placeholder.com/40"} alt="Admin" className="rounded-circle" style={{width: 40, height: 40}} />
            <div className="overflow-hidden">
                <div className="fw-bold small text-truncate">{user?.name}</div>
                <div className="text-muted small text-capitalize" style={{fontSize: '0.7rem'}}>{user?.role}</div>
            </div>
         </div>
         <button onClick={logout} className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
            <FaSignOutAlt /> Đăng xuất
         </button>
      </div>
    </div>
  );
};

export default AdminSidebar;