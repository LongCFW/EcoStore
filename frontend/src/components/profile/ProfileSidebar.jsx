import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaLock, FaSignOutAlt, FaHeart, FaBell, FaTicketAlt } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth'; // Import useAuth
import '../../assets/styles/auth-profile.css';

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth(); // Lấy user và hàm logout

  const menuItems = [
    { id: 'info', label: 'Thông tin tài khoản', icon: <FaUser /> },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: <FaClipboardList /> },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: <FaMapMarkerAlt /> },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> }, 
    { id: 'vouchers', label: 'Kho Voucher', icon: <FaTicketAlt /> },
    { id: 'notifications', label: 'Thông báo', icon: <FaBell /> }
  ];

  // Logic hiển thị an toàn
  const userName = user?.name || "Khách hàng";
  const userAvatar = user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80";

  const handleLogout = () => {
      if(window.confirm("Bạn có chắc muốn đăng xuất?")) {
          logout();
      }
  };

  return (
    <div className="profile-sidebar">
      {/* Avatar Section */}
      <div className="text-center py-4 bg-white border-bottom">
        <div className="avatar-container mb-3">
            <img 
                src={userAvatar} 
                alt="Avatar" 
                className="avatar-img"
            />
        </div>
        <h5 className="fw-bold mb-1">{userName}</h5>
        <span className="badge bg-success bg-opacity-10 text-success border border-success rounded-pill px-3">
            {user?.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
        </span>
      </div>

      {/* Menu List */}
      <div className="py-2">
        {menuItems.map(item => (
            <div 
                key={item.id}
                className={`profile-menu-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
            >
                <span className="fs-5">{item.icon}</span>
                <span>{item.label}</span>
            </div>
        ))}
        
        <div className="my-2 border-top mx-3"></div>

        <div 
            className="profile-menu-item text-danger"
            onClick={handleLogout}
        >
            <span className="fs-5"><FaSignOutAlt /></span>
            <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileSidebar;