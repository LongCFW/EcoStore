import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import { FaBox, FaTag, FaInfoCircle } from 'react-icons/fa';

const NotificationTab = () => {
  const notifications = [
    { id: 1, type: 'order', title: 'Đơn hàng #ORD-001 giao thành công', desc: 'Kiện hàng của bạn đã được giao đến địa chỉ nhà riêng.', time: '2 giờ trước', read: false },
    { id: 2, type: 'promo', title: 'Siêu Sale 20/10 - Giảm 50%', desc: 'Nhập mã ECO50 để được giảm giá toàn bộ sản phẩm xanh.', time: '1 ngày trước', read: true },
    { id: 3, type: 'system', title: 'Cập nhật chính sách bảo mật', desc: 'Chúng tôi vừa cập nhật điều khoản sử dụng mới.', time: '3 ngày trước', read: true },
  ];

  const getIcon = (type) => {
    switch(type) {
        case 'order': return <FaBox className="text-primary" />;
        case 'promo': return <FaTag className="text-danger" />;
        default: return <FaInfoCircle className="text-info" />;
    }
  };

  return (
    <Card className="border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between mb-4">
        <h4 className="fw-bold">Thông báo</h4>
        <a href="#" className="text-decoration-none small">Đánh dấu đã đọc tất cả</a>
      </div>
      
      <ListGroup variant="flush">
        {notifications.map(noti => (
            <ListGroup.Item key={noti.id} className={`d-flex gap-3 py-3 border-bottom ${noti.read ? 'bg-white' : 'bg-light'}`}>
                <div className="fs-4 mt-1">{getIcon(noti.type)}</div>
                <div>
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className={`mb-1 ${!noti.read && 'fw-bold'}`}>{noti.title}</h6>
                        {!noti.read && <Badge bg="danger" pill className="ms-2" style={{fontSize: '0.5rem'}}>Mới</Badge>}
                    </div>
                    <p className="mb-1 text-muted small">{noti.desc}</p>
                    <small className="text-secondary" style={{fontSize: '0.75rem'}}>{noti.time}</small>
                </div>
            </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default NotificationTab;