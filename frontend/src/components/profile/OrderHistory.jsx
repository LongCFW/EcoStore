import React from "react";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

const OrderHistory = () => {
  const orders = [
    {
      id: "#ORD-001",
      date: "2025-01-10",
      total: 245000,
      status: "Delivered",
      items: "Bàn chải tre, Túi vải...",
    },
    {
      id: "#ORD-002",
      date: "2025-01-15",
      total: 120000,
      status: "Shipping",
      items: "Bình giữ nhiệt",
    },
    {
      id: "#ORD-003",
      date: "2025-01-20",
      total: 550000,
      status: "Pending",
      items: "Combo Xà phòng, Khăn...",
    },
    {
      id: "#ORD-004",
      date: "2025-01-22",
      total: 90000,
      status: "Cancelled",
      items: "Ống hút gạo",
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return <Badge bg="success">Giao thành công</Badge>;
      case "Shipping":
        return <Badge bg="primary">Đang vận chuyển</Badge>;
      case "Pending":
        return (
          <Badge bg="warning" text="dark">
            Chờ xử lý
          </Badge>
        );
      case "Cancelled":
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không rõ</Badge>;
    }
  };

  return (
    <Card className="border-0 shadow-sm">
      <Card.Body className="p-4">
        <h4 className="fw-bold mb-4">Lịch sử đơn hàng</h4>
        <Table responsive hover className="align-middle">
          <thead className="bg-light">
            <tr>
              <th>Mã đơn</th>
              <th>Ngày đặt</th>
              <th>Sản phẩm</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="fw-bold text-primary">{order.id}</td>
                <td>{order.date}</td>
                <td className="text-muted small" style={{ maxWidth: "200px" }}>
                  {order.items}
                </td>
                <td className="fw-bold">{order.total.toLocaleString()} đ</td>
                <td>{getStatusBadge(order.status)}</td>
                <td>
                  <Button variant="outline-secondary" size="sm">
                    <FaEye /> Chi tiết
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default OrderHistory;
