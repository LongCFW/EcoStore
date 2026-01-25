import React, { useState } from 'react';
import { Modal, Button, Row, Col, Table, Badge, Tabs, Tab } from 'react-bootstrap';
import { FaUserSlash, FaUserCheck, FaHistory, FaMousePointer, FaEye, FaTimes } from 'react-icons/fa';

const CustomerDetailModal = ({ show, handleClose, customer, handleToggleStatus }) => {
  const [key, setKey] = useState('general');

  if (!customer) return null;

  // Xử lý dữ liệu thật
  // Lấy địa chỉ đầu tiên nếu có, hoặc để trống
  const primaryAddress = customer.addresses && customer.addresses.length > 0 
      ? `${customer.addresses[0].addressLine}, ${customer.addresses[0].city}` 
      : "Chưa cập nhật địa chỉ";

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" scrollable>
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success">Hồ sơ người dùng</Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        {/* HEADER */}
        <Row className="mb-4 align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
                <div className="position-relative d-inline-block">
                    <img 
                        src={customer.avatarUrl || "https://via.placeholder.com/150"} 
                        alt="Avatar" 
                        className="rounded-circle border border-3 border-white shadow-sm object-fit-cover"
                        style={{width: '100px', height: '100px'}}
                    />
                    <span className={`position-absolute bottom-0 end-0 p-2 border border-2 border-white rounded-circle ${customer.status === 1 ? 'bg-success' : 'bg-danger'}`}></span>
                </div>
            </Col>
            <Col md={9}>
                <h4 className="fw-bold mb-1">{customer.name}</h4>
                <div className="d-flex flex-wrap gap-3 text-muted mb-2">
                    <span>{customer.email}</span>
                    <span className="d-none d-md-inline">|</span>
                    <span>{customer.phone || "No Phone"}</span>
                </div>
                <div className="d-flex gap-2">
                    <Badge bg={customer.status === 1 ? 'success' : 'danger'} className="rounded-pill px-3 py-2">
                        {customer.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}
                    </Badge>
                    <Badge bg="info" className="rounded-pill px-3 py-2 text-uppercase text-dark">
                        {customer.role?.name || 'Customer'}
                    </Badge>
                </div>
            </Col>
        </Row>

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4 border-bottom-0">
            {/* TAB 1: TỔNG QUAN (DATA THẬT) */}
            <Tab eventKey="general" title="Tổng Quan">
                <div className="bg-light p-3 rounded-3 mb-4 border">
                    <Row className="g-3">
                        <Col sm={6}><small className="text-muted d-block">Địa chỉ mặc định</small> <strong>{primaryAddress}</strong></Col>
                        <Col sm={6}><small className="text-muted d-block">Ngày tham gia</small> <strong>{new Date(customer.createdAt).toLocaleDateString('vi-VN')}</strong></Col>
                        {/* 2 cái này Fake tạm chờ module Order */}
                        <Col sm={6}><small className="text-muted d-block">Tổng chi tiêu (Demo)</small> <span className="text-success fw-bold">0 đ</span></Col>
                        <Col sm={6}><small className="text-muted d-block">Hạng thành viên (Demo)</small> <Badge bg="secondary">Mới</Badge></Col>
                    </Row>
                </div>

                {/* TABLE ĐƠN HÀNG (GIỮ NGUYÊN DEMO CHỜ MODULE ORDER) */}
                <h6 className="fw-bold mb-3 text-primary"><FaHistory className="me-2"/>Lịch sử mua hàng (Demo)</h6>
                <div className="table-card overflow-hidden">
                    <Table size="sm" hover className="mb-0 custom-table align-middle">
                        <thead className="bg-light">
                            <tr><th>Mã đơn</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th></tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="4" className="text-center text-muted py-3">Chưa có dữ liệu đơn hàng thực tế</td></tr>
                        </tbody>
                    </Table>
                </div>
            </Tab>

            {/* TAB 2: NHẬT KÝ (GIỮ NGUYÊN DEMO) */}
            <Tab eventKey="activity" title="Nhật Ký Hoạt Động">
                <div className="alert alert-info py-2 small mb-3 border-0 bg-info bg-opacity-10 text-info">
                    <FaMousePointer className="me-2"/> Module này đang phát triển.
                </div>
            </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Đóng</Button>
        {/* Chỉ hiện nút khóa nếu không phải admin */}
        {customer.role?.name !== 'admin' && (
            customer.status === 1 ? (
                <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleToggleStatus(customer._id, 1)}>
                    <FaUserSlash className="me-2" /> Khóa tài khoản
                </Button>
            ) : (
                 <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => handleToggleStatus(customer._id, 0)}>
                    <FaUserCheck className="me-2" /> Mở khóa
                </Button>
            )
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;