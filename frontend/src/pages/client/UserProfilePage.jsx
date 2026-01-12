import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileInfo from '../../components/profile/ProfileInfo';
import OrderHistory from '../../components/profile/OrderHistory';
import AddressList from '../../components/profile/AddressList'; 
import WishlistTab from '../../components/profile/WishlistTab'; 
import NotificationTab from '../../components/profile/NotificationTab'; 
import MyVouchers from '../../components/profile/MyVouchers';
import '../../assets/styles/auth-profile.css';

// Component Đổi mật khẩu
const ChangePassword = () => (
    <div className="profile-content-card animate-fade-in">
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-success">Đổi mật khẩu</h4>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-secondary">MẬT KHẨU HIỆN TẠI</Form.Label>
                <Form.Control type="password" placeholder="••••••••" className="modern-input" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label className="fw-bold small text-secondary">MẬT KHẨU MỚI</Form.Label>
                <Form.Control type="password" placeholder="••••••••" className="modern-input" />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label className="fw-bold small text-secondary">XÁC NHẬN MẬT KHẨU MỚI</Form.Label>
                <Form.Control type="password" placeholder="••••••••" className="modern-input" />
            </Form.Group>
            <div className="text-end border-top pt-3">
                <Button variant="success" className="px-4 py-2 rounded-pill fw-bold shadow-sm">Cập nhật mật khẩu</Button>
            </div>
        </Form>
    </div>
);

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');

  const renderContent = () => {
    switch (activeTab) {
        case 'info': return <ProfileInfo />;
        case 'orders': return <OrderHistory />;
        case 'addresses': return <AddressList />;
        case 'wishlist': return <WishlistTab />; 
        case 'vouchers': return <MyVouchers />; // (Tạm thời dùng component cũ nếu chưa sửa)
        case 'notifications': return <NotificationTab />; 
        case 'password': return <ChangePassword />;
        default: return <ProfileInfo />;
    }
  };

  return (
    <div className="profile-wrapper">
      <Container>
        <Row>
            <Col lg={3} className="mb-4">
                <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            </Col>
            <Col lg={9}>
                {renderContent()}
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default UserProfilePage;