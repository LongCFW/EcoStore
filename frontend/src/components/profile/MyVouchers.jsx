import React, { useState } from "react";
import { Card, Row, Col, Badge, Button, Tab, Tabs } from "react-bootstrap";
import { FaTicketAlt, FaCopy, FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";

const MyVouchers = () => {
  // Dữ liệu giả định: Voucher đã lưu vào ví
  const [vouchers] = useState([
    {
      id: 1,
      code: "ECOSTART",
      desc: "Giảm 10% đơn đầu tiên",
      minOrder: 100000,
      expiry: "2025-12-30",
      status: "active",
    }, // Còn hạn
    {
      id: 2,
      code: "FREESHIP",
      desc: "Miễn phí vận chuyển",
      minOrder: 300000,
      expiry: "2025-06-01",
      status: "active",
    }, // Còn hạn
    {
      id: 3,
      code: "TET2024",
      desc: "Lì xì 20k",
      minOrder: 0,
      expiry: "2024-02-15",
      status: "expired",
    }, // Hết hạn
    {
      id: 4,
      code: "WELCOME",
      desc: "Giảm 50k",
      minOrder: 200000,
      expiry: "2024-12-31",
      status: "used",
    }, // Đã dùng
  ]);

  // Hàm render trạng thái badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <Badge bg="success">Sẵn sàng dùng</Badge>;
      case "used":
        return <Badge bg="secondary">Đã sử dụng</Badge>;
      case "expired":
        return <Badge bg="danger">Hết hạn</Badge>;
      default:
        return null;
    }
  };

  // Hàm render danh sách theo bộ lọc status
  const renderVoucherList = (filterStatus) => {
    // Nếu filterStatus là 'all' thì lấy active, còn lại lấy đúng status
    const list =
      filterStatus === "active"
        ? vouchers.filter((v) => v.status === "active")
        : vouchers.filter((v) => v.status === "used" || v.status === "expired");

    if (list.length === 0) {
      return (
        <div className="text-center py-4 text-muted">
          Không có voucher nào ở mục này.
        </div>
      );
    }

    return (
      <Row xs={1} lg={2} className="g-3">
        {list.map((voucher) => (
          <Col key={voucher.id}>
            <Card
              className={`h-100 border-0 shadow-sm ${
                voucher.status !== "active" ? "opacity-75 bg-light" : ""
              }`}
            >
              <Card.Body className="d-flex p-0">
                {/* Phần bên trái: Icon hoặc Hình ảnh */}
                <div
                  className={`p-3 d-flex align-items-center justify-content-center text-white ${
                    voucher.status === "active" ? "bg-success" : "bg-secondary"
                  }`}
                  style={{
                    width: "100px",
                    borderTopLeftRadius: "0.375rem",
                    borderBottomLeftRadius: "0.375rem",
                  }}
                >
                  <FaTicketAlt className="fs-3" />
                </div>

                {/* Phần bên phải: Thông tin */}
                <div className="p-3 flex-grow-1 position-relative">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="fw-bold mb-1 text-success">
                        {voucher.code}
                      </h6>
                      <p className="mb-1 small fw-bold">{voucher.desc}</p>
                    </div>
                    {getStatusBadge(voucher.status)}
                  </div>

                  <p
                    className="text-muted small mb-2"
                    style={{ fontSize: "0.75rem" }}
                  >
                    HSD: {voucher.expiry} <br />
                    Đơn tối thiểu: {voucher.minOrder.toLocaleString()}đ
                  </p>

                  {/* Nút hành động */}
                  {voucher.status === "active" && (
                    <div className="d-flex justify-content-end">
                      <Link to="/products">
                        <Button
                          variant="outline-success"
                          size="sm"
                          className="py-0"
                          style={{ fontSize: "0.8rem" }}
                        >
                          Dùng ngay
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <Card className="border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Kho Voucher</h4>
        <Link to="/offers" className="text-decoration-none small fw-bold">
          Tìm thêm mã giảm giá &rarr;
        </Link>
      </div>

      <Tabs defaultActiveKey="active" className="mb-4 custom-tabs">
        <Tab eventKey="active" title="Có hiệu lực">
          {renderVoucherList("active")}
        </Tab>
        <Tab eventKey="history" title="Lịch sử (Hết hạn/Đã dùng)">
          {renderVoucherList("history")}
        </Tab>
      </Tabs>
    </Card>
  );
};

export default MyVouchers;
