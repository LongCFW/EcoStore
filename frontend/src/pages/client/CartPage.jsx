import React, { useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaCreditCard } from "react-icons/fa";
import CartItem from "../../components/cart/CartItem"; // Import component con

const CartPage = () => {
  // Dữ liệu giả trong giỏ hàng (Sau này sẽ lấy từ Context/API)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Bàn chải tre Eco",
      price: 45000,
      quantity: 2,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Bình giữ nhiệt",
      price: 199000,
      quantity: 1,
      image: "https://via.placeholder.com/150",
    },
  ]);

  // Xử lý thay đổi số lượng
  const handleQuantityChange = (id, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const newQty =
            type === "increase" ? item.quantity + 1 : item.quantity - 1;
          return { ...item, quantity: newQty < 1 ? 1 : newQty };
        }
        return item;
      })
    );
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    }
  };

  // Tính toán tổng tiền
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = 30000; // Phí ship giả định
  const total = subtotal + shippingFee;

  // Giao diện khi giỏ hàng trống
  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <div className="mb-4">
          <img
            src="https://via.placeholder.com/200"
            alt="Empty Cart"
            className="opacity-50"
          />
        </div>
        <h3>Giỏ hàng của bạn đang trống</h3>
        <p className="text-muted">Hãy thêm vài món đồ xanh vào giỏ nhé!</p>
        <Link to="/">
          <Button variant="success">Quay lại mua sắm</Button>
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4 fw-bold">Giỏ hàng ({cartItems.length} sản phẩm)</h2>

      <Row>
        {/* Cột Trái: Danh sách sản phẩm */}
        <Col lg={8}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              {/* Header bảng (ẩn trên mobile nếu cần) */}
              <div className="d-none d-md-flex border-bottom pb-2 mb-3 text-muted fw-bold small">
                <Col md={5}>Sản phẩm</Col>
                <Col md={3}>Số lượng</Col>
                <Col md={3} className="text-end">
                  Thành tiền
                </Col>
                <Col md={1}></Col>
              </div>

              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              ))}
            </Card.Body>
          </Card>

          <Link to="/" className="text-decoration-none text-success fw-medium">
            <FaArrowLeft className="me-2" /> Tiếp tục mua sắm
          </Link>
        </Col>

        {/* Cột Phải: Tổng quan đơn hàng */}
        <Col lg={4}>
        
          {/* START: Phần nhập mã giảm giá */}
          <Card className="shadow-sm border-0 mb-3">
            <Card.Body>
              <h6 className="fw-bold mb-2">Mã giảm giá</h6>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nhập mã voucher"
                />
                <Button variant="outline-success">Áp dụng</Button>
              </div>
            </Card.Body>
          </Card>
          {/* END: Phần nhập mã giảm giá */}

          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">Cộng giỏ hàng</h5>

              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tạm tính:</span>
                <span className="fw-bold">{subtotal.toLocaleString()} đ</span>
              </div>
              <div className="d-flex justify-content-between mb-3 border-bottom pb-3">
                <span className="text-muted">Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString()} đ</span>
              </div>
              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold fs-5">Tổng cộng:</span>
                <span className="fw-bold fs-5 text-danger">
                  {total.toLocaleString()} đ
                </span>
              </div>

              <Link to="/checkout" className="d-block">
                <Button
                  variant="success"
                  className="w-100 py-2 fw-bold text-uppercase"
                >
                  Thanh toán <FaCreditCard className="ms-2" />
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
