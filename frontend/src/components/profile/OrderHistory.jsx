import React, { useState } from "react";
import { Table, Badge, Button, Modal } from "react-bootstrap";
import { FaEye, FaBoxOpen } from "react-icons/fa";

const OrderHistory = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = [
    { id: "#ORD-001", date: "2025-01-20", total: 550000, status: "Pending", items: "Combo Xà phòng, Khăn..." },
    { id: "#ORD-002", date: "2025-01-15", total: 120000, status: "Shipping", items: "Bình giữ nhiệt" },
    { id: "#ORD-003", date: "2025-01-10", total: 245000, status: "Delivered", items: "Bàn chải tre, Túi vải..." },
  ];

  const handleShowDetails = (order) => {
      setSelectedOrder(order);
      setShowModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
        case "Delivered": return <Badge bg="success">Giao thành công</Badge>;
        case "Shipping": return <Badge bg="primary">Đang vận chuyển</Badge>;
        case "Pending": return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
        default: return <Badge bg="secondary">Đã hủy</Badge>;
    }
  };

  return (
    <div className="profile-content-card animate-fade-in">
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-primary"><FaBoxOpen className="me-2"/>Lịch sử đơn hàng</h4>
        <Table responsive hover className="align-middle">
            <thead className="bg-light text-secondary">
                <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th className="text-end">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td className="fw-bold text-success">{order.id}</td>
                        <td>{order.date}</td>
                        <td className="fw-bold">{order.total.toLocaleString()} đ</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td className="text-end">
                            <Button variant="outline-primary" size="sm" className="rounded-pill px-3" onClick={() => handleShowDetails(order)}>
                                <FaEye className="me-1"/> Chi tiết
                            </Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>

        {/* Modal Chi Tiết Đơn Hàng (Demo) */}
        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết đơn hàng {selectedOrder?.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p><strong>Ngày đặt:</strong> {selectedOrder?.date}</p>
                <p><strong>Trạng thái:</strong> {selectedOrder?.status}</p>
                <hr/>
                <h6>Sản phẩm:</h6>
                <p className="text-muted">{selectedOrder?.items}</p>
                <h5 className="text-end text-success mt-3">Tổng tiền: {selectedOrder?.total.toLocaleString()} đ</h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Đóng</Button>
            </Modal.Footer>
        </Modal>
    </div>
  );
};

export default OrderHistory;