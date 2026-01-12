import React from "react";
import { Row, Col, Button, Form } from "react-bootstrap";
import { FaTrash, FaMinus, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className="border-bottom py-3">
      <Row className="align-items-center">
        {/* Hình ảnh & Tên */}
        <Col md={5} className="d-flex align-items-center gap-3">
          <Link to={`/product/${item.id}`}>
            <img
              src={item.image}
              alt={item.name}
              className="rounded"
              style={{ width: "80px", height: "80px", objectFit: "cover" }}
            />
          </Link>
          <div>
            <Link
              to={`/product/${item.id}`}
              className="text-decoration-none text-dark fw-medium"
            >
              {item.name}
            </Link>
            <div className="text-muted small mt-1">
              Đơn giá: {item.price.toLocaleString()} đ
            </div>
          </div>
        </Col>

        {/* Bộ chỉnh số lượng */}
        <Col md={3} className="my-2 my-md-0">
          <div
            className="input-group input-group-sm"
            style={{ maxWidth: "120px" }}
          >
            <Button
              variant="outline-secondary"
              onClick={() => onQuantityChange(item.id, "decrease")}
            >
              <FaMinus size={12} />
            </Button>
            <Form.Control
              className="text-center"
              value={item.quantity}
              readOnly
            />
            <Button
              variant="outline-secondary"
              onClick={() => onQuantityChange(item.id, "increase")}
            >
              <FaPlus size={12} />
            </Button>
          </div>
        </Col>

        {/* Tổng tiền của dòng này */}
        <Col md={3} className="text-md-end fw-bold text-primary">
          {(item.price * item.quantity).toLocaleString()} đ
        </Col>

        {/* Nút xóa */}
        <Col md={1} className="text-end">
          <Button
            variant="link"
            className="text-danger p-0"
            onClick={() => onRemove(item.id)}
          >
            <FaTrash />
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CartItem;
