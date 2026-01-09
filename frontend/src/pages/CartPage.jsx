import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Table,
  Button,
  Form,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [items, setItems] = useState([
    {
      id: 1,
      name: "Bộ Ống Hút Tre Tự Nhiên",
      price: 50000,
      img: "https://placehold.co/100x100/E8F5E9/2E7D32?text=Straw",
      qty: 2,
      checked: true,
    },
    {
      id: 2,
      name: "Túi Vải Canvas Eco",
      price: 120000,
      img: "https://placehold.co/100x100/F1F8E9/2E7D32?text=Bag",
      qty: 1,
      checked: false,
    },
    {
      id: 3,
      name: "Bình Giữ Nhiệt Tre",
      price: 250000,
      img: "https://placehold.co/100x100/C8E6C9/2E7D32?text=Bottle",
      qty: 1,
      checked: true,
    },
  ]);

  const toggleCheck = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const toggleAll = (e) => {
    const checked = e.target.checked;
    setItems(items.map((item) => ({ ...item, checked })));
  };

  const updateQty = (id, delta) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const removeSelected = () => {
    if (window.confirm("Xóa các sản phẩm đã chọn?")) {
      setItems(items.filter((item) => !item.checked));
    }
  };

  // Chỉ tính tiền các sản phẩm được tích chọn
  const subtotal = items
    .filter((i) => i.checked)
    .reduce((sum, item) => sum + item.price * item.qty, 0);
  const isAllChecked = items.length > 0 && items.every((i) => i.checked);
  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-success">
        <i className="bi bi-cart-check-fill"></i> Giỏ Hàng
      </h2>

      <Row>
        <Col lg={8}>
          <div className="bg-white rounded shadow-sm overflow-hidden mb-4">
            {/* Header Bảng */}
            <div className="p-3 bg-light border-bottom d-flex align-items-center fw-bold">
              <Form.Check
                type="checkbox"
                className="me-3"
                checked={isAllChecked}
                onChange={toggleAll}
                label={`Tất cả (${items.length} sản phẩm)`}
              />
              <div
                className="ms-auto text-muted small cursor-pointer"
                onClick={removeSelected}
              >
                <i className="bi bi-trash"></i> Xóa đã chọn
              </div>
            </div>

            {/* Danh sách Item */}
            {items.length === 0 ? (
              <div className="text-center py-5">
                <p>Giỏ hàng trống.</p>
                <Link to="/products" className="btn btn-success rounded-pill">
                  Mua sắm ngay
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 border-bottom d-flex align-items-center gap-3 hover-bg-light transition-bg"
                >
                  <Form.Check
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => toggleCheck(item.id)}
                  />
                  <Link to={`/product/${item.id}`}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className="rounded border"
                      width="80"
                      height="80"
                      style={{ objectFit: "cover" }}
                    />
                  </Link>
                  <div className="flex-grow-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-decoration-none text-dark fw-bold"
                    >
                      {item.name}
                    </Link>
                    <div className="text-muted small">Phân loại: Tự nhiên</div>
                    <div className="d-flex align-items-center mt-2 d-md-none">
                      <span className="text-success fw-bold me-2">
                        {(item.price * item.qty).toLocaleString()}đ
                      </span>
                    </div>
                  </div>
                  <div className="d-none d-md-block text-muted">
                    {item.price.toLocaleString()}đ
                  </div>
                  <div>
                    <div
                      className="input-group input-group-sm"
                      style={{ width: "100px" }}
                    >
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQty(item.id, -1)}
                      >
                        -
                      </Button>
                      <Form.Control
                        className="text-center px-1"
                        value={item.qty}
                        readOnly
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => updateQty(item.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="d-none d-md-block fw-bold text-success w-15 text-end">
                    {(item.price * item.qty).toLocaleString()}đ
                  </div>
                  <Button
                    variant="link"
                    className="text-danger p-0 ms-2"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>
              ))
            )}
          </div>
        </Col>

        {/* Sidebar Sticky Fix */}
        <Col lg={4}>
          <div className="sidebar-summary">
            {" "}
            {/* Class mới đã định nghĩa trong CSS */}
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h5 className="fw-bold mb-4">Thanh Toán</h5>

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Đã chọn:</span>
                  <span>{checkedCount} sản phẩm</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính:</span>
                  <span className="fw-bold">{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="d-flex justify-content-between mb-4">
                  <span className="text-muted">Giảm giá:</span>
                  <span className="text-danger">-0đ</span>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fw-bold fs-5">Tổng cộng:</span>
                  <div className="text-end">
                    <div className="fw-bold fs-3 text-success">
                      {subtotal.toLocaleString()}đ
                    </div>
                    <small className="text-muted">(Đã bao gồm VAT)</small>
                  </div>
                </div>

                <Button
                  as={Link}
                  to="/checkout"
                  variant="success"
                  size="lg"
                  className="w-100 rounded-pill fw-bold shadow-sm"
                  disabled={checkedCount === 0}
                >
                  Mua Hàng ({checkedCount})
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
