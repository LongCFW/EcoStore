import { Modal, Button, Row, Col, Table, Badge, Card } from 'react-bootstrap';
import { FaUserSlash, FaUserCheck, FaHistory } from 'react-icons/fa';

const CustomerDetailModal = ({ show, handleClose, customer, handleToggleStatus }) => {
  // Dữ liệu giả định: Lịch sử mua hàng của khách này
  // (Thực tế sẽ gọi API getOrdersByCustomerId)
  const orderHistory = [
    { id: 'ORD-001', date: '2025-01-20', total: 450000, status: 'Completed' },
    { id: 'ORD-009', date: '2024-12-15', total: 120000, status: 'Cancelled' },
    { id: 'ORD-012', date: '2024-11-01', total: 850000, status: 'Completed' },
  ];

  if (!customer) return null;

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Hồ sơ khách hàng: {customer.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="mb-4">
            {/* Cột trái: Avatar & Thông tin cơ bản */}
            <Col md={4} className="text-center border-end">
                <img 
                    src={customer.avatar || "https://via.placeholder.com/150"} 
                    alt="Avatar" 
                    className="rounded-circle mb-3 border p-1"
                    style={{width: '120px', height: '120px', objectFit: 'cover'}}
                />
                <h5 className="fw-bold">{customer.name}</h5>
                <p className="text-muted mb-1">{customer.email}</p>
                <p className="text-muted">{customer.phone}</p>
                
                <div className="mt-3">
                    {customer.status === 'Active' ? (
                        <Badge bg="success" className="px-3 py-2">Đang hoạt động</Badge>
                    ) : (
                        <Badge bg="danger" className="px-3 py-2">Đã bị khóa</Badge>
                    )}
                </div>
            </Col>

            {/* Cột phải: Thông tin chi tiết */}
            <Col md={8}>
                <h6 className="fw-bold text-uppercase text-muted small mb-3">Thông tin chi tiết</h6>
                <p><strong>Địa chỉ:</strong> {customer.address}</p>
                <p><strong>Ngày đăng ký:</strong> {customer.joinDate}</p>
                <p><strong>Tổng chi tiêu:</strong> <span className="text-success fw-bold">15.400.000 đ</span></p>
                <p><strong>Hạng thành viên:</strong> <Badge bg="warning" text="dark">Vàng (Gold)</Badge></p>
            </Col>
        </Row>

        {/* Lịch sử đơn hàng */}
        <Card className="border-0 bg-light">
            <Card.Body>
                <h6 className="fw-bold mb-3"><FaHistory className="me-2"/>Lịch sử mua hàng gần đây</h6>
                <Table size="sm" hover className="mb-0 bg-white rounded">
                    <thead>
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
                                <td>
                                    {order.status === 'Completed' ? <Badge bg="success">Hoàn thành</Badge> : <Badge bg="danger">Đã hủy</Badge>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Đóng</Button>
        
        {/* Nút Khóa / Mở khóa tài khoản */}
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