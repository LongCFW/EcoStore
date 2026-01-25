import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ProfileSidebar from '../../components/profile/ProfileSidebar';
import ProfileInfo from '../../components/profile/ProfileInfo';
import OrderHistory from '../../components/profile/OrderHistory';
import AddressList from '../../components/profile/AddressList'; 
import WishlistTab from '../../components/profile/WishlistTab'; 
import NotificationTab from '../../components/profile/NotificationTab'; 
import MyVouchers from '../../components/profile/MyVouchers';
import '../../assets/styles/auth-profile.css';
import { useAuth } from '../../hooks/useAuth';

const UserProfilePage = () => {
  const [activeTab, setActiveTab] = useState('info');
  const { user } = useAuth();
  const renderContent = () => {
    switch (activeTab) {
        case 'info': return <ProfileInfo key={user?.email || 'guest'}/>;
        case 'orders': return <OrderHistory />;
        case 'addresses': return <AddressList />;
        case 'wishlist': return <WishlistTab />; 
        case 'vouchers': return <MyVouchers />; 
        case 'notifications': return <NotificationTab />; 
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