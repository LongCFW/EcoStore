import React, { useState } from 'react';
import { Modal, Button, Row, Col, Table, Badge, Card, Tabs, Tab } from 'react-bootstrap';
// 👇 ĐÃ BỔ SUNG FaSearch VÀO ĐÂY (Lần trước bị thiếu)
import { FaUserSlash, FaUserCheck, FaHistory, FaMousePointer, FaEye, FaSignInAlt, FaSearch } from 'react-icons/fa';

const CustomerDetailModal = ({ show, handleClose, customer, handleToggleStatus }) => {
  const [key, setKey] = useState('general');

  // Dữ liệu giả: Lịch sử đơn hàng
  const orderHistory = [
    { id: 'ORD-001', date: '2025-01-20', total: 450000, status: 'Completed' },
    { id: 'ORD-009', date: '2024-12-15', total: 120000, status: 'Cancelled' },
  ];

  // Dữ liệu giả: Nhật ký hành vi khách hàng (Tracking Logs)
  const activityLogs = [
    { id: 1, action: 'View Product', detail: 'Xem sản phẩm "Bàn chải tre"', time: '20/01/2025 10:30', ip: '192.168.1.1', icon: <FaEye /> },
    { id: 2, action: 'Add to Cart', detail: 'Thêm "Bình giữ nhiệt" vào giỏ', time: '20/01/2025 10:35', ip: '192.168.1.1', icon: <FaMousePointer /> },
    { id: 3, action: 'Login', detail: 'Đăng nhập thành công', time: '20/01/2025 09:00', ip: '192.168.1.1', icon: <FaSignInAlt /> },
    { id: 4, action: 'Search', detail: 'Tìm kiếm từ khóa "Eco friendly"', time: '19/01/2025 15:20', ip: '192.168.1.1', icon: <FaSearch /> },
  ];

  if (!customer) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Hồ sơ khách hàng: {customer.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        {/* Phần Header chung cố định */}
        <Row className="mb-4 align-items-center">
            <Col md={3} className="text-center">
                <img 
                    src={customer.avatar || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    className="rounded-circle border p-1"
                    style={{width: '80px', height: '80px', objectFit: 'cover'}}
                />
            </Col>
            <Col md={9}>
                <h5 className="fw-bold mb-1">{customer.name}</h5>
                <div className="d-flex gap-3 text-muted small">
                    <span>{customer.email}</span>
                    <span>|</span>
                    <span>{customer.phone}</span>
                </div>
                <div className="mt-2">
                    {customer.status === 'Active' ? <Badge bg="success">Active</Badge> : <Badge bg="danger">Locked</Badge>}
                </div>
            </Col>
        </Row>

        <Tabs
            id="customer-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-3"
        >
            {/* TAB 1: THÔNG TIN CHUNG & ĐƠN HÀNG */}
            <Tab eventKey="general" title="Thông tin & Đơn hàng">
                <Row className="mb-3">
                    <Col md={12}>
                        <Card className="border-0 bg-light mb-3">
                            <Card.Body>
                                <Row>
                                    <Col xs={6}><p className="mb-1"><strong>Địa chỉ:</strong> {customer.address}</p></Col>
                                    <Col xs={6}><p className="mb-1"><strong>Ngày tham gia:</strong> {customer.joinDate}</p></Col>
                                    <Col xs={6}><p className="mb-0"><strong>Tổng chi tiêu:</strong> <span className="text-success fw-bold">15.400.000 đ</span></p></Col>
                                    <Col xs={6}><p className="mb-0"><strong>Hạng:</strong> <Badge bg="warning" text="dark">Vàng</Badge></p></Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <h6 className="fw-bold mb-3"><FaHistory className="me-2"/>Lịch sử mua hàng</h6>
                <Table size="sm" hover className="mb-0 bg-white border rounded">
                    <thead className="bg-light">
                        <tr>
                            <th>Mã đơn</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orderHistory.map((order, idx) => (
                            <tr key={idx}>
                                <td className="fw-bold text-primary">{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.total.toLocaleString()} đ</td>
                                <td>{order.status === 'Completed' ? <Badge bg="success">Hoàn thành</Badge> : <Badge bg="danger">Đã hủy</Badge>}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Tab>

            {/* TAB 2: NHẬT KÝ HOẠT ĐỘNG (TRACKING LOGS) */}
            <Tab eventKey="activity" title="Nhật ký hoạt động (Tracking)">
                <div className="alert alert-info py-2 small">
                    <FaMousePointer className="me-2"/>
                    Ghi lại các hành vi tương tác, click, tìm kiếm của khách hàng trên website.
                </div>
                <div className="activity-timeline" style={{maxHeight: '300px', overflowY: 'auto'}}>
                    <Table hover size="sm" className="align-middle">
                        <thead className="bg-light sticky-top">
                            <tr>
                                <th>Hành động</th>
                                <th>Chi tiết</th>
                                <th>Thời gian</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLogs.map((log) => (
                                <tr key={log.id}>
                                    <td><span className="text-primary me-2">{log.icon}</span> <strong>{log.action}</strong></td>
                                    <td>{log.detail}</td>
                                    <td className="text-muted small">{log.time}</td>
                                    <td className="text-muted small">{log.ip}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Tab>
        </Tabs>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        {customer.status === 'Active' ? (
            <Button variant="danger" onClick={() => handleToggleStatus(customer.id, 'Locked')}>
                <FaUserSlash className="me-2" /> Khóa tài khoản
            </Button>
        ) : (
             <Button variant="success" onClick={() => handleToggleStatus(customer.id, 'Active')}>
                <FaUserCheck className="me-2" /> Mở khóa
            </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;