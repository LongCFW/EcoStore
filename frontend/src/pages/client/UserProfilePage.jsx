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
import { useSearchParams } from 'react-router-dom';


// Định nghĩa danh sách tab hợp lệ để tránh lỗi khi user gõ bậy bạ trên URL
const VALID_TABS = ['info', 'orders', 'addresses', 'wishlist', 'vouchers', 'notifications'];

const UserProfilePage = () => {
  const { user } = useAuth();
  
  // 2. useSearchParams
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Lấy giá trị ?tab=... từ URL
  const tabParam = searchParams.get('tab');

  // 3. Logic tính toán activeTab:
  // Nếu trên URL có tab hợp lệ -> dùng nó.
  // Nếu không (hoặc mới vào trang) -> mặc định là 'info'
  const activeTab = VALID_TABS.includes(tabParam) ? tabParam : 'info';

  // 4. Hàm này sẽ được truyền xuống Sidebar thay vì hàm setState cũ
  // Khi Sidebar bấm nút, nó sẽ cập nhật URL -> URL đổi -> activeTab tự đổi -> Giao diện đổi
  const handleSwitchTab = (tabName) => {
      setSearchParams({ tab: tabName });
  };

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
                <ProfileSidebar activeTab={activeTab} setActiveTab={handleSwitchTab} />
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