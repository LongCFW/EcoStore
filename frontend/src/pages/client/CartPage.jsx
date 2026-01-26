import React, { useState, useMemo } from "react";
import { Container, Row, Col, Card, Button, Form, ProgressBar, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaMinus, FaPlus, FaArrowRight, FaCheckCircle, FaSignInAlt, FaShoppingCart, FaTicketAlt } from "react-icons/fa";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import '../../assets/styles/cart-checkout.css';

const CartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const [selectedItems, setSelectedItems] = useState([]);
  const [couponCode, setCouponCode] = useState(""); // State lưu mã voucher

  // --- SAFE GUARD: Lọc sạch item lỗi ---
  const validCartItems = useMemo(() => {
      return Array.isArray(cartItems) 
        ? cartItems.filter(item => item && item.productId && item.productId._id)
        : [];
  }, [cartItems]);

  const handleSelectItem = (itemId) => {
      setSelectedItems(prev => 
          prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
      );
  };

  const handleSelectAll = (e) => {
      if (e.target.checked) {
          const allIds = validCartItems.map(item => item.productId._id);
          setSelectedItems(allIds);
      } else {
          setSelectedItems([]);
      }
  };

  const handleRemoveSelected = () => {
      if(window.confirm(`Bạn muốn xóa ${selectedItems.length} sản phẩm đã chọn?`)) {
          selectedItems.forEach(id => removeFromCart(id));
          setSelectedItems([]);
      }
  };

  // --- TÍNH TOÁN TIỀN ---
  const subtotal = useMemo(() => {
      return validCartItems.reduce((acc, item) => {
          const price = item.productId.price_cents || 0;
          if (selectedItems.includes(item.productId._id)) {
              return acc + (price * item.quantity);
          }
          return acc;
      }, 0);
  }, [validCartItems, selectedItems]);

  // Logic Phí Ship
  const FREESHIP_THRESHOLD = 300000;
  const SHIPPING_FEE = 30000;
  const isFreeShip = subtotal >= FREESHIP_THRESHOLD;
  const currentShippingFee = (subtotal > 0 && !isFreeShip) ? SHIPPING_FEE : 0; // Chỉ tính ship khi có chọn sản phẩm

  // Tổng thanh toán cuối cùng (Tạm tính + Ship - Giảm giá)
  const finalTotal = subtotal + currentShippingFee; // - discount (sau này thêm)

  const progress = Math.min((subtotal / FREESHIP_THRESHOLD) * 100, 100);
  const isAllSelected = validCartItems.length > 0 && selectedItems.length === validCartItems.length;

  // --- RENDER ---
  if (!user) {
      return (
          <Container className="py-5 text-center" style={{minHeight: '60vh'}}>
              <div className="mb-4 opacity-50"><FaSignInAlt size={80} className="text-secondary"/></div>
              <h3 className="fw-bold mb-3">Bạn chưa đăng nhập</h3>
              <Button as={Link} to="/login" variant="success" size="lg" className="rounded-pill px-5 shadow">Đăng nhập ngay</Button>
          </Container>
      );
  }

  if (validCartItems.length === 0) {
    return (
      <Container className="py-5 text-center" style={{minHeight: '60vh'}}>
        <div className="mb-4 opacity-50"><FaShoppingCart size={80} className="text-secondary"/></div>
        <h3 className="fw-bold mb-3">Giỏ hàng đang trống</h3>
        <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 shadow">Mua Sắm Ngay</Button>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Container className="py-4">
        {/* Step Wizard (Giữ nguyên) */}
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
            <div className="bg-white p-3 rounded shadow-sm mb-3 d-flex justify-content-between align-items-center">
                <Form.Check 
                    type="checkbox" 
                    id="selectAll"
                    label={`Chọn tất cả (${validCartItems.length})`}
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="fw-bold cursor-pointer"
                />
                {selectedItems.length > 0 && (
                    <Button variant="link" className="text-danger p-0 text-decoration-none small fw-bold" onClick={handleRemoveSelected}>
                        <FaTrash className="me-1"/> Xóa đã chọn ({selectedItems.length})
                    </Button>
                )}
            </div>

            <div className="d-flex flex-column gap-3">
                {validCartItems.map((item) => {
                    const product = item.productId;
                    const price = product.price_cents || 0;
                    const isSelected = selectedItems.includes(product._id);

                    return (
                        <Card key={product._id} className={`border-0 shadow-sm overflow-hidden ${isSelected ? 'border-success border-2' : ''}`}>
                            <Card.Body className="p-3">
                                <Row className="align-items-center">
                                    <Col xs={1} className="d-flex justify-content-center">
                                        <Form.Check 
                                            type="checkbox" 
                                            checked={isSelected}
                                            onChange={() => handleSelectItem(product._id)}
                                        />
                                    </Col>

                                    <Col xs={3} md={2}>
                                        <Link to={`/product/${product.slug}`}>
                                            <img 
                                                src={product.images?.[0]?.imageUrl || 'https://placehold.co/100'} 
                                                alt={product.name} 
                                                className="img-fluid rounded border" 
                                            />
                                        </Link>
                                    </Col>
                                    <Col xs={8} md={9}>
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    <Link to={`/product/${product.slug}`} className="text-dark text-decoration-none text-truncate-2-lines">
                                                        {product.name}
                                                    </Link>
                                                </h6>
                                                <span className="text-success fw-bold">{price.toLocaleString()} đ</span>
                                            </div>
                                            <button className="btn btn-light text-danger rounded-circle p-2 btn-sm" onClick={() => removeFromCart(product._id)}>
                                                <FaTrash size={14}/>
                                            </button>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="input-group input-group-sm border rounded-pill overflow-hidden" style={{width: '100px'}}>
                                                <button className="btn btn-light border-0 px-2" onClick={() => updateQuantity(product._id, item.quantity - 1)} disabled={item.quantity <= 1}><FaMinus size={10}/></button>
                                                <input type="text" className="form-control border-0 text-center bg-white p-0 fw-bold" value={item.quantity} readOnly />
                                                <button className="btn btn-light border-0 px-2" onClick={() => updateQuantity(product._id, item.quantity + 1)}><FaPlus size={10}/></button>
                                            </div>
                                            <span className="fw-bold text-dark">{(price * item.quantity).toLocaleString()} đ</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );
                })}
            </div>
            
            <div className="mt-4">
                <Link to="/products" className="text-decoration-none text-muted d-inline-flex align-items-center gap-2 hover-green">
                    <FaArrowLeft /> Tiếp tục mua sắm
                </Link>
            </div>
          </Col>

          {/* RIGHT: SUMMARY */}
          <Col lg={4} className="mt-4 mt-lg-0">
            <Card className="border-0 shadow-sm sticky-summary">
                <Card.Body className="p-4">
                    <h5 className="fw-bold mb-4">Cộng giỏ hàng</h5>
                    
                    {/* Freeship Progress */}
                    <div className="mb-4">
                        {subtotal > 0 && (
                            <>
                                {subtotal < FREESHIP_THRESHOLD ? (
                                    <p className="mb-1 small">Mua thêm <span className="text-success fw-bold">{(FREESHIP_THRESHOLD - subtotal).toLocaleString()} đ</span> để Freeship</p>
                                ) : (
                                    <p className="mb-1 small text-success fw-bold"><FaCheckCircle className="me-1"/> Đơn hàng được Freeship!</p>
                                )}
                                <ProgressBar now={progress} variant="success" style={{height: '6px'}} className="rounded-pill"/>
                            </>
                        )}
                    </div>

                    {/* --- Ô NHẬP VOUCHER (MỚI) --- */}
                    <div className="mb-4">
                        <label className="form-label small fw-bold text-muted">MÃ GIẢM GIÁ</label>
                        <InputGroup>
                            <InputGroup.Text className="bg-white border-end-0 text-success"><FaTicketAlt/></InputGroup.Text>
                            <Form.Control 
                                placeholder="Nhập mã voucher" 
                                className="border-start-0 border-end-0 shadow-none"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                            />
                            <Button variant="outline-success" onClick={() => alert("Tính năng Voucher đang phát triển!")}>Áp dụng</Button>
                        </InputGroup>
                    </div>
                    {/* ----------------------------- */}

                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Tạm tính</span>
                        <span className="fw-bold">{subtotal.toLocaleString()} đ</span>
                    </div>
                    
                    {/* Hiển thị Phí Ship */}
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">Phí vận chuyển</span>
                        {/* Logic hiển thị:
                            1. Nếu chưa chọn gì (subtotal === 0) -> Hiển thị "---" hoặc 0đ
                            2. Nếu FreeShip -> Hiển thị "Miễn phí"
                            3. Còn lại -> Hiển thị phí ship 30k
                        */}
                        {subtotal === 0 ? (
                             <span className="fw-bold">0 đ</span> 
                        ) : isFreeShip ? (
                            <span className="text-success fw-bold">Miễn phí</span>
                        ) : (
                            <span className="fw-bold">{currentShippingFee.toLocaleString()} đ</span>
                        )}
                    </div>

                    <div className="d-flex justify-content-between mb-4 border-bottom pb-4">
                        <span className="text-muted">Giảm giá</span>
                        <span className="text-success">- 0 đ</span>
                    </div>

                    <div className="d-flex justify-content-between mb-4">
                        <span className="fw-bold fs-5">Tổng tiền</span>
                        <span className="fw-bold fs-4 text-success">{finalTotal.toLocaleString()} đ</span>
                    </div>
                    
                    <Button 
                        variant="success" 
                        size="lg" 
                        className="w-100 rounded-pill fw-bold shadow-sm d-flex justify-content-between align-items-center px-4"
                        onClick={() => navigate('/checkout')}
                        disabled={selectedItems.length === 0} 
                    >
                        <span>Đặt hàng</span>
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