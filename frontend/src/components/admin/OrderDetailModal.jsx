import React, { useState } from 'react';
import { Modal, Button, Row, Col, Table, Badge, Form } from 'react-bootstrap';
import { FaPrint, FaSave, FaTimes, FaUser, FaMapMarkerAlt, FaPhone, FaBox } from 'react-icons/fa';

const OrderDetailModal = ({ show, handleClose, order, onUpdateStatus }) => {
  const [status, setStatus] = useState(order?.status || 'pending');

  // Helper: Màu sắc trạng thái
  const getStatusColor = (st) => {
      switch(st) {
          case 'completed': return 'success';
          case 'shipping': return 'primary';
          case 'pending': return 'warning';
          case 'cancelled': return 'danger';
          default: return 'secondary';
      }
  };

  const handleSave = () => {
      onUpdateStatus(order.id, status);
      handleClose();
  };

  if (!order) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" backdrop="static">
      {/* HEADER: Mã đơn & Trạng thái hiện tại */}
      <Modal.Header className="border-0 bg-light align-items-center">
        <div>
            <h5 className="fw-bold text-success mb-1">Chi Tiết Đơn Hàng #{order.id}</h5>
            <small className="text-muted">Ngày đặt: {order.date}</small>
        </div>
        <div className="d-flex align-items-center gap-3">
            <Badge bg={getStatusColor(order.status)} className="px-3 py-2 rounded-pill text-uppercase">
                {order.statusLabel}
            </Badge>
            <button className="icon-btn border-0" onClick={handleClose}><FaTimes/></button>
        </div>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        {/* 1. THÔNG TIN KHÁCH HÀNG & GIAO HÀNG */}
        <Row className="g-4 mb-4">
            <Col md={6}>
                <div className="p-3 rounded-3 border h-100 bg-white">
                    <h6 className="fw-bold text-muted mb-3 text-uppercase small"><FaUser className="me-2"/>Thông tin khách hàng</h6>
                    <p className="fw-bold mb-1">{order.customer}</p>
                    <p className="mb-1 text-muted small"><FaPhone className="me-2"/>{order.phone}</p>
                    <p className="mb-0 text-muted small">Email: {order.email}</p>
                </div>
            </Col>
            <Col md={6}>
                <div className="p-3 rounded-3 border h-100 bg-white">
                    <h6 className="fw-bold text-muted mb-3 text-uppercase small"><FaMapMarkerAlt className="me-2"/>Địa chỉ giao hàng</h6>
                    <p className="mb-2 text-muted small">{order.address}</p>
                    <div className="mt-auto">
                        <span className="badge bg-light text-dark border">Thanh toán: {order.paymentMethod}</span>
                    </div>
                </div>
            </Col>
        </Row>

        {/* 2. DANH SÁCH SẢN PHẨM */}
        <div className="border rounded-3 overflow-hidden mb-4">
            <Table hover responsive className="mb-0 custom-table align-middle">
                <thead className="bg-light">
                    <tr>
                        <th className="ps-3">Sản phẩm</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Đơn giá</th>
                        <th className="text-end pe-3">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items?.map((item, idx) => (
                        <tr key={idx}>
                            <td className="ps-3">
                                <div className="d-flex align-items-center gap-2">
                                    <div className="bg-light rounded p-1 border">
                                        <FaBox className="text-success"/>
                                    </div>
                                    <span className="fw-medium">{item.name}</span>
                                </div>
                            </td>
                            <td className="text-center">x{item.quantity}</td>
                            <td className="text-end text-muted">{item.price.toLocaleString()} đ</td>
                            <td className="text-end fw-bold pe-3">{(item.price * item.quantity).toLocaleString()} đ</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>

        {/* 3. TỔNG KẾT & CẬP NHẬT TRẠNG THÁI */}
        <Row className="align-items-end">
            <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-muted">CẬP NHẬT TRẠNG THÁI</Form.Label>
                    <Form.Select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value)}
                        className="admin-input"
                    >
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipping">Đang vận chuyển</option>
                        <option value="completed">Đã giao hàng (Hoàn thành)</option>
                        <option value="cancelled">Đã hủy</option>
                    </Form.Select>
                </Form.Group>
            </Col>
            <Col md={6}>
                <div className="bg-light p-3 rounded-3">
                    <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Tạm tính:</span>
                        <span>{order.subtotal?.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2 small text-muted">
                        <span>Phí vận chuyển:</span>
                        <span>{order.shippingFee?.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between border-top border-secondary border-opacity-10 pt-2">
                        <span className="fw-bold text-success fs-5">Tổng cộng:</span>
                        <span className="fw-bold text-success fs-5">{order.total?.toLocaleString()} đ</span>
                    </div>
                </div>
            </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" className="rounded-pill px-3" onClick={() => alert("Tính năng in đang phát triển")}>
            <FaPrint className="me-2"/> In hóa đơn
        </Button>
        <div className="flex-grow-1"></div>
        <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Đóng</Button>
        <Button variant="success" onClick={handleSave} className="rounded-pill px-4 fw-bold shadow-sm">
            <FaSave className="me-2"/> Lưu thay đổi
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;