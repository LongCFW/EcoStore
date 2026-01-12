import React, { useState } from "react";
import { Container, Row, Col, Card, Button, Form, ProgressBar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaMinus, FaPlus, FaArrowRight, FaTicketAlt, FaShoppingCart, FaCheckCircle } from "react-icons/fa";
import '../../assets/styles/cart-checkout.css';

const CartPage = () => {
  const navigate = useNavigate();
  // Dữ liệu giả
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Bàn chải tre Eco", price: 45000, quantity: 2, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=150" },
    { id: 3, name: "Bình giữ nhiệt", price: 199000, quantity: 1, image: "https://images.unsplash.com/photo-1602143407151-51115da92c4a?auto=format&fit=crop&w=150" },
  ]);

  const handleQuantity = (id, type) => {
    setCartItems(items => items.map(item => {
        if(item.id === id) {
            const newQty = type === 'inc' ? item.quantity + 1 : item.quantity - 1;
            return {...item, quantity: Math.max(1, newQty)};
        }
        return item;
    }));
  };

  const handleRemove = (id) => {
      if(window.confirm("Xóa sản phẩm này?")) {
          setCartItems(items => items.filter(item => item.id !== id));
      }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const FREESHIP_THRESHOLD = 300000;
  const progress = Math.min((subtotal / FREESHIP_THRESHOLD) * 100, 100);

  // Empty State
  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center" style={{minHeight: '60vh'}}>
        <div className="mb-4 opacity-50"><FaShoppingCart size={80} className="text-secondary"/></div>
        <h3 className="fw-bold mb-3">Giỏ hàng đang trống</h3>
        <p className="text-muted mb-4">Hãy thêm vài món đồ xanh vào giỏ nhé!</p>
        <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 shadow">Mua Sắm Ngay</Button>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Container className="py-4">
        {/* STEP WIZARD */}
        <div className="step-wizard">
            <div className="step-item active">
                <div className="step-count">1</div>
                <span className="step-text">Giỏ hàng</span>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
                <div className="step-count">2</div>
                <span className="step-text">Thanh toán</span>
            </div>
            <div className="step-line"></div>
            <div className="step-item">
                <div className="step-count">3</div>
                <span className="step-text">Hoàn tất</span>
            </div>
        </div>

        <Row>
          {/* LEFT: CART ITEMS */}
          <Col lg={8}>
            {/* Freeship Progress */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <Card.Body className="bg-white">
                    {subtotal < FREESHIP_THRESHOLD ? (
                        <p className="mb-2 small">Mua thêm <span className="text-success fw-bold">{(FREESHIP_THRESHOLD - subtotal).toLocaleString()} đ</span> để được <span className="fw-bold text-success">Freeship</span></p>
                    ) : (
                        <p className="mb-2 small text-success fw-bold"><FaCheckCircle className="me-1"/> Bạn đã được Miễn Phí Vận Chuyển!</p>
                    )}
                    <ProgressBar now={progress} variant="success" style={{height: '6px'}} className="rounded-pill"/>
                </Card.Body>
            </Card>

            {/* List Items */}
            <div className="d-flex flex-column gap-3">
                {cartItems.map(item => (
                    <Card key={item.id} className="border-0 shadow-sm overflow-hidden">
                        <Card.Body className="p-3">
                            <Row className="align-items-center">
                                <Col xs={3} md={2}>
                                    <img src={item.image} alt={item.name} className="img-fluid rounded border" />
                                </Col>
                                <Col xs={9} md={10}>
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <div>
                                            <h6 className="fw-bold mb-1"><Link to={`/product/${item.id}`} className="text-dark text-decoration-none">{item.name}</Link></h6>
                                            <span className="text-success fw-bold">{item.price.toLocaleString()} đ</span>
                                        </div>
                                        <button className="btn btn-light text-danger rounded-circle p-2 btn-sm" onClick={() => handleRemove(item.id)}>
                                            <FaTrash size={14}/>
                                        </button>
                                    </div>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="input-group input-group-sm border rounded-pill overflow-hidden" style={{width: '100px'}}>
                                            <button className="btn btn-light border-0 px-2" onClick={() => handleQuantity(item.id, 'dec')}><FaMinus size={10}/></button>
                                            <input type="text" className="form-control border-0 text-center bg-white p-0 fw-bold" value={item.quantity} readOnly />
                                            <button className="btn btn-light border-0 px-2" onClick={() => handleQuantity(item.id, 'inc')}><FaPlus size={10}/></button>
                                        </div>
                                        <span className="fw-bold text-dark">{(item.price * item.quantity).toLocaleString()} đ</span>
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <div className="mt-4">
                <Link to="/products" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-green">
                    <FaArrowLeft /> Tiếp tục mua sắm
                </Link>
            </div>
          </Col>

          {/* RIGHT: SUMMARY (STICKY) */}
          <Col lg={4} className="mt-4 mt-lg-0">
            <Card className="border-0 shadow-sm sticky-summary">
                <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Cộng giỏ hàng</h5>
                    
                    {/* Coupon Input */}
                    <div className="mb-4">
                        <label className="form-label small text-muted fw-bold">MÃ GIẢM GIÁ</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white text-success border-end-0"><FaTicketAlt /></span>
                            <Form.Control placeholder="Nhập mã voucher" className="border-start-0 ps-0 shadow-none"/>
                            <Button variant="outline-success">Áp dụng</Button>
                        </div>
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tạm tính</span>
                        <span className="fw-bold">{subtotal.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4 border-bottom pb-4">
                        <span className="text-muted">Giảm giá</span>
                        <span className="text-success">- 0 đ</span>
                    </div>
                    <div className="d-flex justify-content-between mb-4">
                        <span className="fw-bold fs-5">Tổng tiền</span>
                        <span className="fw-bold fs-4 text-success">{subtotal.toLocaleString()} đ</span>
                    </div>
                    
                    <p className="text-muted small mb-4 fst-italic">* Phí vận chuyển sẽ được tính ở bước thanh toán.</p>

                    <Button 
                        variant="success" 
                        size="lg" 
                        className="w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-between align-items-center px-4"
                        onClick={() => navigate('/checkout')}
                    >
                        <span>Thanh toán</span>
                        <FaArrowRight />
                    </Button>
                </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;