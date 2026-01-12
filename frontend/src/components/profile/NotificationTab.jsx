import React, { useState } from 'react';
import { ListGroup, Badge, Modal, Button } from 'react-bootstrap';
import { FaBox, FaTag, FaInfoCircle, FaBell } from 'react-icons/fa';

const NotificationTab = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'order', title: 'Đơn hàng #ORD-001 giao thành công', desc: 'Kiện hàng của bạn đã được giao đến địa chỉ nhà riêng.', time: '2 giờ trước', read: false, content: "Chi tiết: Shipper đã giao cho người nhà lúc 10h sáng. Vui lòng kiểm tra kiện hàng." },
    { id: 2, type: 'promo', title: 'Siêu Sale 20/10 - Giảm 50%', desc: 'Nhập mã ECO50 để được giảm giá toàn bộ sản phẩm xanh.', time: '1 ngày trước', read: true, content: "Chương trình áp dụng cho toàn bộ sản phẩm. HSD: 25/10." },
  ]);
  
  const [showModal, setShowModal] = useState(false);
  const [selectedNoti, setSelectedNoti] = useState(null);

  const handleRead = (noti) => {
      setSelectedNoti(noti);
      setShowModal(true);
      // Đánh dấu đã đọc
      setNotifications(prev => prev.map(n => n.id === noti.id ? {...n, read: true} : n));
  };

  const getIcon = (type) => {
    switch(type) {
        case 'order': return <FaBox className="text-primary" />;
        case 'promo': return <FaTag className="text-danger" />;
        default: return <FaInfoCircle className="text-info" />;
    }
  };

  return (
    <div className="profile-content-card animate-fade-in">
      <div className="d-flex justify-content-between mb-4 pb-3 border-bottom align-items-center">
        <h4 className="fw-bold m-0 text-warning"><FaBell className="me-2"/>Thông báo</h4>
        <span className="text-muted small hover-green fw-medium" style={{cursor: 'pointer'}} onClick={() => setNotifications(prev => prev.map(n => ({...n, read: true})))}>Đánh dấu đã đọc tất cả</span>
      </div>
      
      <ListGroup variant="flush">
        {notifications.map(noti => (
            <ListGroup.Item 
                key={noti.id} 
                className={`noti-item d-flex gap-3 py-3 border-bottom ${!noti.read ? 'unread' : ''}`}
                onClick={() => handleRead(noti)}
            >
                <div className="fs-4 mt-1 bg-white p-2 rounded-circle shadow-sm" style={{height: 'fit-content'}}>{getIcon(noti.type)}</div>
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <h6 className={`mb-1 ${!noti.read ? 'fw-bold text-dark' : 'text-secondary'}`}>{noti.title}</h6>
                        {!noti.read && <div className="bg-danger rounded-circle" style={{width: 8, height: 8}}></div>}
                    </div>
                    <p className="mb-1 text-muted small">{noti.desc}</p>
                    <small className="text-secondary opacity-75" style={{fontSize: '0.75rem'}}>{noti.time}</small>
                </div>
            </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Modal xem chi tiết */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton><Modal.Title>{selectedNoti?.title}</Modal.Title></Modal.Header>
          <Modal.Body>{selectedNoti?.content}</Modal.Body>
          <Modal.Footer><Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default NotificationTab;