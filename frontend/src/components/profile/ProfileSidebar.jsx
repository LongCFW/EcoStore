import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';
import { FaUser, FaClipboardList, FaMapMarkerAlt, FaLock, FaSignOutAlt, FaHeart, FaBell } from 'react-icons/fa'; // Import thêm icon

const ProfileSidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'info', label: 'Thông tin tài khoản', icon: <FaUser /> },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: <FaClipboardList /> },
    { id: 'addresses', label: 'Sổ địa chỉ', icon: <FaMapMarkerAlt /> },
    { id: 'wishlist', label: 'Sản phẩm yêu thích', icon: <FaHeart /> }, 
    { id: 'notifications', label: 'Thông báo', icon: <FaBell /> }, 
    { id: 'password', label: 'Đổi mật khẩu', icon: <FaLock /> },
  ];

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="text-center py-4">
        <img 
            src="https://via.placeholder.com/150" 
            alt="Avatar" 
            className="rounded-circle mb-3 border border-3 border-success p-1"
            style={{width: '100px', height: '100px', objectFit: 'cover'}}
        />
        <h5 className="fw-bold">Nguyễn Văn A</h5>
        <p className="text-muted small">Thành viên Bạc</p>
      </Card.Body>
      <ListGroup variant="flush">
        {menuItems.map(item => (
            <ListGroup.Item 
                key={item.id}
                action 
                active={activeTab === item.id}
                onClick={() => setActiveTab(item.id)}
                className={`d-flex align-items-center gap-3 py-3 border-0 ${activeTab === item.id ? 'bg-success text-white fw-bold' : 'text-dark'}`}
                style={{cursor: 'pointer'}}
            >
                {item.icon} {item.label}
            </ListGroup.Item>
        ))}
        
        <ListGroup.Item 
            action 
            className="d-flex align-items-center gap-3 py-3 text-danger border-0 fw-bold"
            onClick={() => {
                if(window.confirm("Bạn có chắc muốn đăng xuất?")) {
                    window.location.href = "/login"; 
                }
            }}
        >
            <FaSignOutAlt /> Đăng xuất
        </ListGroup.Item>
      </ListGroup>
    </Card>
  );
};

export default ProfileSidebar;