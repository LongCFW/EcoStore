import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, Row, Col, Badge, Form } from 'react-bootstrap';

const OrderDetailModal = ({ show, handleClose, order, handleUpdateStatus }) => {
  const [status, setStatus] = useState('');

  // FIX LỖI: Chỉ cập nhật state khi có order và modal đang mở
  useEffect(() => {
    if (order && show) {
      setStatus(order.status);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, show]);

  const onSaveStatus = () => {
    handleUpdateStatus(order.id, status);
    handleClose();
  };

  if (!order) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết đơn hàng #{order.id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Thông tin chung */}
        <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded">
            <div>
                <strong>Ngày đặt:</strong> {order.date}
            </div>
            <div>
                <strong>Trạng thái: </strong>
                {status === 'Pending' && <Badge bg="warning" text="dark">Chờ xử lý</Badge>}
                {status === 'Shipping' && <Badge bg="primary">Đang giao hàng</Badge>}
                {status === 'Completed' && <Badge bg="success">Hoàn thành</Badge>}
                {status === 'Cancelled' && <Badge bg="danger">Đã hủy</Badge>}
            </div>
        </div>

        <Row className="mb-4">
            {/* Cột trái: Thông tin khách hàng */}
            <Col md={6}>
                <h6 className="fw-bold border-bottom pb-2">Thông tin khách hàng</h6>
                <p className="mb-1"><strong>Tên:</strong> {order.customer}</p>
                <p className="mb-1"><strong>SĐT:</strong> {order.phone}</p>
                <p className="mb-1"><strong>Email:</strong> {order.email}</p>
                <p className="mb-0"><strong>Địa chỉ:</strong> {order.address}</p>
            </Col>

             {/* Cột phải: Thông tin thanh toán */}
             <Col md={6}>
                <h6 className="fw-bold border-bottom pb-2">Thanh toán & Vận chuyển</h6>
                <p className="mb-1"><strong>Phương thức:</strong> {order.paymentMethod}</p>
                <p className="mb-1"><strong>Phí vận chuyển:</strong> {order.shippingFee.toLocaleString()} đ</p>
                <p className="mb-0"><strong>Ghi chú:</strong> {order.note || 'Không có'}</p>
            </Col>
        </Row>

        {/* Bảng sản phẩm */}
        <h6 className="fw-bold border-bottom pb-2 mb-3">Sản phẩm đã đặt</h6>
        <Table responsive bordered className="align-middle">
            <thead className="bg-light">
                <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-end">Đơn giá</th>
                    <th className="text-end">Thành tiền</th>
                </tr>
            </thead>
            <tbody>
                {order.items.map((item, idx) => (
                    <tr key={idx}>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <img src={item.image} alt="" style={{width: 40, height: 40, objectFit: 'cover'}} className="rounded"/>
                                <span>{item.name}</span>
                            </div>
                        </td>
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-end">{item.price.toLocaleString()} đ</td>
                        <td className="text-end fw-bold">{(item.price * item.quantity).toLocaleString()} đ</td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr>
                    <td colSpan="3" className="text-end fw-bold">Tổng cộng (đã gồm ship)</td>
                    <td className="text-end fw-bold text-danger fs-5">{order.total.toLocaleString()} đ</td>
                </tr>
            </tfoot>
        </Table>

        {/* Khu vực xử lý đơn hàng */}
        <div className="mt-4 p-3 border rounded border-warning bg-warning bg-opacity-10">
            <h6 className="fw-bold mb-3">Xử lý đơn hàng</h6>
            <div className="d-flex gap-3 align-items-center">
                <Form.Select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    style={{maxWidth: '300px'}}
                >
                    <option value="Pending">Chờ xử lý (Pending)</option>
                    <option value="Shipping">Đang giao hàng (Shipping)</option>
                    <option value="Completed">Hoàn thành (Completed)</option>
                    <option value="Cancelled">Hủy đơn (Cancelled)</option>
                </Form.Select>
                <Button variant="success" onClick={onSaveStatus} disabled={status === order.status}>
                    Cập nhật trạng thái
                </Button>
            </div>
        </div>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailModal;