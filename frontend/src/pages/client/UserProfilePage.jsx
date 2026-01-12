import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileInfo from '../../components/profile/ProfileInfo';
import OrderHistory from '../../components/profile/OrderHistory';
import AddressList from '../../components/profile/AddressList'; 
import WishlistTab from '../../components/profile/WishlistTab'; 
import NotificationTab from '../../components/profile/NotificationTab'; 

// Component ChangePassword đơn giản (giữ nguyên hoặc tách nếu muốn)
const ChangePassword = () => (
    <Card className="border-0 shadow-sm p-4">
        <h4 className="fw-bold mb-4">Đổi mật khẩu</h4>
        <Form>
            <Form.Group className="mb-3"><Form.Label>Mật khẩu hiện tại</Form.Label><Form.Control type="password" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Mật khẩu mới</Form.Label><Form.Control type="password" /></Form.Group>
            <Form.Group className="mb-3"><Form.Label>Xác nhận mật khẩu mới</Form.Label><Form.Control type="password" /></Form.Group>
            <Button variant="success">Cập nhật mật khẩu</Button>
        </Form>
    </Card>
);

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');

  const renderContent = () => {
    switch (activeTab) {
        case 'info': return <ProfileInfo />;
        case 'orders': return <OrderHistory />;
        case 'addresses': return <AddressList />;
        case 'wishlist': return <WishlistTab />; 
        case 'notifications': return <NotificationTab />; 
        case 'password': return <ChangePassword />;
        default: return <ProfileInfo />;
    }
  };

  return (
    <div className="bg-light py-5" style={{minHeight: '80vh'}}>
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