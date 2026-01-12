import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup, Row, Col } from 'react-bootstrap';
import { FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import OrderDetailModal from '../../components/admin/OrderDetailModal';

const OrderManager = () => {
  // Dữ liệu giả định phong phú hơn
  const [orders, setOrders] = useState([
    { 
        id: "ORD-001", customer: "Nguyễn Văn A", date: "2025-01-20", total: 135000, status: "Pending", 
        phone: "0901234567", email: "a@gmail.com", address: "123 Lê Lợi, TP.HCM", paymentMethod: "COD", shippingFee: 30000,
        items: [
            { name: "Bàn chải tre", price: 45000, quantity: 2, image: "https://via.placeholder.com/50" },
            { name: "Kem đánh răng", price: 15000, quantity: 1, image: "https://via.placeholder.com/50" }
        ]
    },
    { 
        id: "ORD-002", customer: "Trần Thị B", date: "2025-01-19", total: 550000, status: "Shipping",
        phone: "0909888777", email: "b@gmail.com", address: "456 Nguyễn Huệ, TP.HCM", paymentMethod: "Banking", shippingFee: 0,
        items: [
            { name: "Bộ quà tặng Eco", price: 550000, quantity: 1, image: "https://via.placeholder.com/50" }
        ]
    },
    { 
        id: "ORD-003", customer: "Lê Văn C", date: "2025-01-18", total: 90000, status: "Completed",
        phone: "0912345678", email: "c@gmail.com", address: "789 Cách Mạng Tháng 8", paymentMethod: "Momo", shippingFee: 15000,
        items: [
             { name: "Túi vải", price: 75000, quantity: 1, image: "https://via.placeholder.com/50" }
        ]
    },
    { 
        id: "ORD-004", customer: "Phạm Văn D", date: "2025-01-15", total: 200000, status: "Cancelled",
        phone: "0987654321", email: "d@gmail.com", address: "Hà Nội", paymentMethod: "COD", shippingFee: 30000,
        items: [
             { name: "Bình giữ nhiệt", price: 170000, quantity: 1, image: "https://via.placeholder.com/50" }
        ]
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Mở modal xem chi tiết
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Cập nhật trạng thái đơn hàng từ Modal
  const handleUpdateStatus = (id, newStatus) => {
    setOrders(prevOrders => prevOrders.map(order => 
        order.id === id ? { ...order, status: newStatus } : order
    ));
    // Có thể gọi API cập nhật backend tại đây
    alert(`Đã cập nhật đơn hàng ${id} sang trạng thái: ${newStatus}`);
  };

  // Logic lọc: Kết hợp Tìm kiếm và Filter Status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
        order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Helper render badge trạng thái
  const getStatusBadge = (status) => {
      switch(status) {
          case 'Pending': return <Badge bg="warning" text="dark">Chờ xử lý</Badge>;
          case 'Shipping': return <Badge bg="primary">Đang giao</Badge>;
          case 'Completed': return <Badge bg="success">Hoàn thành</Badge>;
          case 'Cancelled': return <Badge bg="danger">Đã hủy</Badge>;
          default: return <Badge bg="secondary">Không rõ</Badge>;
      }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý Đơn hàng</h2>
        <Button variant="outline-primary" onClick={() => window.print()}>
             In danh sách
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <Row className="g-3">
                <Col md={4}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><FaSearch className="text-muted"/></InputGroup.Text>
                        <Form.Control 
                            placeholder="Tìm theo Mã đơn hoặc Tên khách..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={3}>
                    <InputGroup>
                        <InputGroup.Text className="bg-white"><FaFilter className="text-muted"/></InputGroup.Text>
                        <Form.Select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">Tất cả trạng thái</option>
                            <option value="Pending">Chờ xử lý</option>
                            <option value="Shipping">Đang giao hàng</option>
                            <option value="Completed">Hoàn thành</option>
                            <option value="Cancelled">Đã hủy</option>
                        </Form.Select>
                    </InputGroup>
                </Col>
            </Row>
        </Card.Header>
        <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light text-secondary">
                    <tr>
                        <th className="ps-4">Mã đơn</th>
                        <th>Khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th className="text-end pe-4">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length > 0 ? filteredOrders.map(order => (
                        <tr key={order.id}>
                            <td className="ps-4 fw-bold text-primary">{order.id}</td>
                            <td>
                                <div>{order.customer}</div>
                                <small className="text-muted">{order.phone}</small>
                            </td>
                            <td>{order.date}</td>
                            <td className="fw-bold">{order.total.toLocaleString()} đ</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td className="text-end pe-4">
                                <Button variant="outline-secondary" size="sm" onClick={() => handleViewOrder(order)}>
                                    <FaEye /> Xem chi tiết
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">
                                Không tìm thấy đơn hàng nào phù hợp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Card.Body>
        <Card.Footer className="bg-white py-3 text-end">
             <small className="text-muted">Hiển thị {filteredOrders.length} đơn hàng</small>
        </Card.Footer>
      </Card>

      {/* Modal Chi Tiết */}
      <OrderDetailModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        order={selectedOrder}
        handleUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManager;