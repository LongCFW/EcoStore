import React from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
    FaTachometerAlt, FaBox, FaShoppingBag, FaUsers, 
    FaChartBar, FaSignOutAlt, FaCogs 
} from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
      // Xử lý logout sau này
      navigate('/login');
  };

  return (
    <div className="bg-dark text-white d-flex flex-column p-3 vh-100 position-fixed" style={{width: '250px'}}>
      <Link to="/admin" className="text-decoration-none text-white mb-4">
        <h3 className="fw-bold text-success">EcoAdmin</h3>
      </Link>
      
      <Nav className="flex-column gap-2 flex-grow-1">
        <Nav.Item>
            <Nav.Link as={NavLink} to="/admin" end className="text-white d-flex align-items-center gap-2">
                <FaTachometerAlt /> Dashboard
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to="/admin/products" className="text-white d-flex align-items-center gap-2">
                <FaBox /> Quản lý Sản phẩm
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to="/admin/orders" className="text-white d-flex align-items-center gap-2">
                <FaShoppingBag /> Quản lý Đơn hàng
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to="/admin/customers" className="text-white d-flex align-items-center gap-2">
                <FaUsers /> Khách hàng
            </Nav.Link>
        </Nav.Item>
        <Nav.Item>
            <Nav.Link as={NavLink} to="/admin/stats" className="text-white d-flex align-items-center gap-2">
                <FaChartBar /> Thống kê
            </Nav.Link>
        </Nav.Item>
         <Nav.Item>
            <Nav.Link as={NavLink} to="/admin/settings" className="text-white d-flex align-items-center gap-2">
                <FaCogs /> Cấu hình
            </Nav.Link>
        </Nav.Item>
      </Nav>

      <div className="mt-auto border-top pt-3">
         <div className="d-flex align-items-center gap-2 mb-3">
            <img src="https://via.placeholder.com/40" alt="Admin" className="rounded-circle" />
            <div>
                <div className="fw-bold small">Admin User</div>
                <div className="text-muted small" style={{fontSize: '0.7rem'}}>admin@ecostore.com</div>
            </div>
         </div>
         <button onClick={handleLogout} className="btn btn-outline-danger w-100 btn-sm d-flex align-items-center justify-content-center gap-2">
            <FaSignOutAlt /> Đăng xuất
         </button>
      </div>
    </div>
  );
};

export default AdminSidebar;