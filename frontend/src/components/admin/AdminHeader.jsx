import React from 'react';
import { Form, Dropdown, Button } from 'react-bootstrap';
import { FaBars, FaSearch, FaMoon, FaSun, FaUserCircle, FaSignOutAlt, FaHome } from 'react-icons/fa'; // Thêm FaHome
import { useAuth } from '../../context/AuthContext';
import { useAdminTheme } from '../../context/useAdminTheme';
import { Link } from 'react-router-dom';

const AdminHeader = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useAdminTheme();

  // Ảnh demo người thật để test hình tròn
  const demoAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80";

  return (
    <header className="admin-header">
      {/* 1. Left: Toggle & Title */}
      <div className="d-flex align-items-center gap-3">
        <Button variant="link" className="p-0 text-decoration-none d-lg-none" onClick={toggleSidebar}>
            <FaBars size={24} style={{color: 'var(--admin-text)'}} />
        </Button>
        <h5 className="m-0 fw-bold d-none d-md-block" style={{color: 'var(--admin-text)'}}>Dashboard</h5>
      </div>

      {/* 2. Middle: Search */}
      <div className="header-search d-none d-md-block">
         <div className="position-relative">
            <Form.Control 
                type="text" 
                placeholder="Tìm kiếm nhanh..." 
                style={{
                    backgroundColor: 'var(--admin-bg)', 
                    color: 'var(--admin-text)',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '20px',
                    paddingLeft: '40px',
                    minWidth: '300px'
                }}
            />
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
         </div>
      </div>

      {/* 3. Right: Actions */}
      <div className="d-flex align-items-center gap-3">
        
        {/* NÚT VỀ TRANG CHỦ (MỚI THÊM) */}
        <Link to="/" className="icon-btn text-decoration-none" title="Về trang chủ cửa hàng">
            <FaHome />
        </Link>

        {/* Chế độ Sáng/Tối */}
        <button className="icon-btn" onClick={toggleTheme} title="Chế độ Sáng/Tối">
            {theme === 'light' ? <FaMoon /> : <FaSun className="text-warning"/>}
        </button>

        {/* User Dropdown */}
        <Dropdown align="end">
            <Dropdown.Toggle as="div" className="d-flex align-items-center gap-2 border-0 p-0 cursor-pointer" style={{cursor: 'pointer'}}>
                {/* Class header-avatar đã được CSS fix cứng hình tròn */}
                <img 
                    src={user?.avatar || demoAvatar} 
                    alt="Admin" 
                    className="header-avatar"
                />
                <div className="d-none d-lg-block text-start">
                    <div className="fw-bold small" style={{color: 'var(--admin-text)'}}>{user?.name || "Admin User"}</div>
                    <div className="text-muted" style={{fontSize: '0.7rem'}}>{user?.role || "Administrator"}</div>
                </div>
            </Dropdown.Toggle>

            <Dropdown.Menu className="border-0 shadow-lg mt-3 rounded-3 animate-slide-up" style={{backgroundColor: 'var(--admin-card-bg)', minWidth: '200px'}}>
                <div className="px-3 py-2 border-bottom border-light">
                    <span className="text-muted small fw-bold text-uppercase">Tài khoản</span>
                </div>
                <Dropdown.Item as={Link} to="/admin/profile" className="d-flex align-items-center gap-2 py-2 mt-1 dropdown-item-custom">
                    <FaUserCircle className="text-success"/> 
                    <span style={{color: 'var(--admin-text)'}}>Hồ sơ cá nhân</span>
                </Dropdown.Item>
                <Dropdown.Divider style={{borderColor: 'var(--admin-border)'}}/>
                <Dropdown.Item onClick={logout} className="text-danger fw-bold d-flex align-items-center gap-2 py-2 mb-1 dropdown-item-custom">
                    <FaSignOutAlt /> Đăng xuất
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default AdminHeader;