import React, { useState } from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import { FaPlus, FaTrash, FaPen } from "react-icons/fa";

const AddressList = () => {
  // Dữ liệu giả
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      address: "123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Văn A (Công ty)",
      phone: "0909888777",
      address: "Tòa nhà Bitexco, Quận 1, TP. Hồ Chí Minh",
      isDefault: false,
    },
  ]);

  // Hàm xử lý xóa địa chỉ (Fix lỗi unused var)
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      const newAddresses = addresses.filter((item) => item.id !== id);
      setAddresses(newAddresses); // Đã sử dụng setAddresses
    }
  };

  return (
    <Card className="border-0 shadow-sm p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Sổ địa chỉ</h4>
        <Button variant="success" size="sm">
          <FaPlus /> Thêm địa chỉ mới
        </Button>
      </div>

      {addresses.map((item) => (
        <div
          key={item.id}
          className="border rounded p-3 mb-3 position-relative bg-white"
        >
          {item.isDefault && (
            <Badge bg="success" className="position-absolute top-0 end-0 m-2">
              Mặc định
            </Badge>
          )}

          <Row>
            <Col md={10}>
              <p className="fw-bold mb-1">
                {item.name}{" "}
                <span className="fw-normal text-muted">| {item.phone}</span>
              </p>
              <p className="text-muted mb-2 text-break">{item.address}</p>
            </Col>
            <Col
              md={2}
              className="d-flex align-items-center justify-content-end gap-2"
            >
              <Button variant="outline-primary" size="sm">
                <FaPen />
              </Button>
              {/* Chỉ hiện nút xóa nếu không phải mặc định */}
              {!item.isDefault && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <FaTrash />
                </Button>
              )}
            </Col>
          </Row>
        </div>
      ))}
    </Card>
  );
};

export default AddressList;
