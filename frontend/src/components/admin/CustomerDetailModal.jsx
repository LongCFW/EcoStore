import React, { useState } from 'react';
import { Modal, Button, Row, Col, Table, Badge, Card, Tabs, Tab } from 'react-bootstrap';
import { FaUserSlash, FaUserCheck, FaHistory, FaMousePointer, FaEye, FaSignInAlt, FaSearch, FaTimes } from 'react-icons/fa';

const CustomerDetailModal = ({ show, handleClose, customer, handleToggleStatus }) => {
  const [key, setKey] = useState('general');

  // Dữ liệu giả
  const orderHistory = [
    { id: 'ORD-001', date: '2025-01-20', total: 450000, status: 'Completed' },
    { id: 'ORD-009', date: '2024-12-15', total: 120000, status: 'Cancelled' },
  ];

  const activityLogs = [
    { id: 1, action: 'View Product', detail: 'Xem sản phẩm "Bàn chải tre"', time: '20/01/2025 10:30', ip: '192.168.1.1', icon: <FaEye /> },
    { id: 2, action: 'Add to Cart', detail: 'Thêm "Bình giữ nhiệt" vào giỏ', time: '20/01/2025 10:35', ip: '192.168.1.1', icon: <FaMousePointer /> },
    { id: 3, action: 'Login', detail: 'Đăng nhập thành công', time: '20/01/2025 09:00', ip: '192.168.1.1', icon: <FaSignInAlt /> },
    { id: 4, action: 'Search', detail: 'Tìm kiếm từ khóa "Eco friendly"', time: '19/01/2025 15:20', ip: '192.168.1.1', icon: <FaSearch /> },
  ];

  if (!customer) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" scrollable>
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success">Hồ sơ khách hàng</Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        {/* HEADER KHÁCH HÀNG */}
        <Row className="mb-4 align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
                <div className="position-relative d-inline-block">
                    <img 
                        src={customer.avatar || "https://via.placeholder.com/150"} 
                        alt="Avatar" 
                        className="rounded-circle border border-3 border-white shadow-sm object-fit-cover"
                        style={{width: '100px', height: '100px'}}
                    />
                    <span className={`position-absolute bottom-0 end-0 p-2 border border-2 border-white rounded-circle ${customer.status === 'Active' ? 'bg-success' : 'bg-danger'}`}></span>
                </div>
            </Col>
            <Col md={9}>
                <h4 className="fw-bold mb-1">{customer.name}</h4>
                <div className="d-flex flex-wrap gap-3 text-muted mb-2">
                    <span>{customer.email}</span>
                    <span className="d-none d-md-inline">|</span>
                    <span>{customer.phone}</span>
                </div>
                <Badge bg={customer.status === 'Active' ? 'success' : 'danger'} className="rounded-pill px-3 py-2">
                    {customer.status === 'Active' ? 'Đang hoạt động' : 'Đã khóa'}
                </Badge>
            </Col>
        </Row>

        <Tabs
            id="customer-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className="mb-4 border-bottom-0"
        >
            {/* TAB 1: THÔNG TIN */}
            <Tab eventKey="general" title="Tổng Quan">
                <div className="bg-light p-3 rounded-3 mb-4 border">
                    <Row className="g-3">
                        <Col sm={6}><small className="text-muted d-block">Địa chỉ</small> <strong>{customer.address}</strong></Col>
                        <Col sm={6}><small className="text-muted d-block">Ngày tham gia</small> <strong>{customer.joinDate}</strong></Col>
                        <Col sm={6}><small className="text-muted d-block">Tổng chi tiêu</small> <span className="text-success fw-bold">15.400.000 đ</span></Col>
                        <Col sm={6}><small className="text-muted d-block">Hạng thành viên</small> <Badge bg="warning" text="dark">Vàng</Badge></Col>
                    </Row>
                </div>

                <h6 className="fw-bold mb-3 text-primary"><FaHistory className="me-2"/>Lịch sử mua hàng</h6>
                <div className="table-card overflow-hidden">
                    <Table size="sm" hover className="mb-0 custom-table align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-3">Mã đơn</th>
                                <th>Ngày đặt</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderHistory.map((order, idx) => (
                                <tr key={idx}>
                                    <td className="ps-3 fw-bold text-primary">{order.id}</td>
                                    <td>{order.date}</td>
                                    <td className="fw-bold">{order.total.toLocaleString()} đ</td>
                                    <td>
                                        {order.status === 'Completed' 
                                            ? <Badge bg="success" className="rounded-pill">Hoàn thành</Badge> 
                                            : <Badge bg="danger" className="rounded-pill">Đã hủy</Badge>
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </Tab>

            {/* TAB 2: TRACKING LOGS */}
            <Tab eventKey="activity" title="Nhật Ký Hoạt Động">
                <div className="alert alert-info py-2 small mb-3 border-0 bg-info bg-opacity-10 text-info">
                    <FaMousePointer className="me-2"/>
                    Ghi lại các hành vi tương tác, click, tìm kiếm của khách hàng.
                </div>
                <div className="table-card overflow-hidden" style={{maxHeight: '350px', overflowY: 'auto'}}>
                    <Table hover size="sm" className="mb-0 custom-table align-middle">
                        <thead className="bg-light sticky-top" style={{top: 0, zIndex: 1}}>
                            <tr>
                                <th className="ps-3">Hành động</th>
                                <th>Chi tiết</th>
                                <th>Thời gian</th>
                                <th>IP</th>
                            </tr>
                        </thead>
                        <tbody>
                            {activityLogs.map((log) => (
                                <tr key={log.id}>
                                    <td className="ps-3">
                                        <span className="text-primary me-2">{log.icon}</span> 
                                        <strong>{log.action}</strong>
                                    </td>
                                    <td className="text-muted">{log.detail}</td>
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

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Đóng</Button>
        {customer.status === 'Active' ? (
            <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleToggleStatus(customer.id, 'Locked')}>
                <FaUserSlash className="me-2" /> Khóa tài khoản
            </Button>
        ) : (
             <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleToggleStatus(customer.id, 'Active')}>
                <FaUserCheck className="me-2" /> Mở khóa
            </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;