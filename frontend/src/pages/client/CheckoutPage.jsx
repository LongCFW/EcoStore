import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, FloatingLabel, Badge } from 'react-bootstrap';
import { FaCreditCard, FaMoneyBillWave, FaUniversity, FaArrowLeft, FaMapMarkerAlt, FaUser, FaPhoneAlt, FaEnvelope, FaPlusCircle, FaAddressBook } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import '../../assets/styles/cart-checkout.css';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);
  
  // STATE ĐỊA CHỈ
  const [useNewAddress, setUseNewAddress] = useState(false); // false: dùng sổ địa chỉ, true: nhập mới
  const [selectedAddressId, setSelectedAddressId] = useState(1); // Mặc định chọn địa chỉ đầu

  // Dữ liệu giả từ Sổ địa chỉ (Backend sẽ trả về)
  const savedAddresses = [
    { id: 1, name: "Nguyễn Văn A", phone: "0901234567", address: "123 Đường Lê Lợi, P. Bến Nghé, Quận 1, TP.HCM", type: "Nhà riêng", default: true },
    { id: 2, name: "Văn phòng Eco", phone: "0909888999", address: "Tòa nhà Bitexco, Số 2 Hải Triều, Q.1, TP.HCM", type: "Công ty", default: false },
  ];

  // Dữ liệu giỏ hàng giả lập
  const cartItems = [
    { id: 1, name: "Bàn chải tre Eco", price: 45000, quantity: 2, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=150" },
    { id: 3, name: "Bình giữ nhiệt", price: 199000, quantity: 1, image: "https://images.unsplash.com/photo-1602143407151-51115da92c4a?auto=format&fit=crop&w=150" },
  ];
  const subtotal = 289000;
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = () => {
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          alert("Đặt hàng thành công! (Demo)");
          navigate('/');
      }, 2000);
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
      <Container className="py-4">
        
        {/* Nút quay lại giỏ hàng */}
        <div className="mb-4">
            <Link to="/cart" className="text-decoration-none text-muted hover-green fw-medium">
                <FaArrowLeft className="me-2"/> Quay lại giỏ hàng
            </Link>
        </div>

        {/* STEP WIZARD */}
        <div className="step-wizard">
            <div className="step-item">
                <div className="step-count">1</div>
                <span className="step-text">Giỏ hàng</span>
            </div>
            <div className="step-line active"></div>
            <div className="step-item active">
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
            {/* LEFT: SHIPPING INFO & PAYMENT */}
            <Col lg={7}>
                {/* 1. THÔNG TIN GIAO HÀNG */}
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="fw-bold m-0 d-flex align-items-center gap-2">
                                <span className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 30, height: 30, fontSize: '0.9rem'}}>1</span>
                                Thông tin giao hàng
                            </h5>
                            
                            {/* Toggle Button */}
                            {!useNewAddress ? (
                                <Button variant="outline-success" size="sm" onClick={() => setUseNewAddress(true)}>
                                    <FaPlusCircle className="me-1"/> Nhập địa chỉ khác
                                </Button>
                            ) : (
                                <Button variant="outline-secondary" size="sm" onClick={() => setUseNewAddress(false)}>
                                    <FaAddressBook className="me-1"/> Chọn từ sổ địa chỉ
                                </Button>
                            )}
                        </div>
                        
                        {/* LOGIC HIỂN THỊ: Sổ địa chỉ HOẶC Form nhập mới */}
                        {!useNewAddress ? (
                            <div className="d-flex flex-column gap-3">
                                {savedAddresses.map(addr => (
                                    <div 
                                        key={addr.id} 
                                        className={`payment-card p-3 d-flex align-items-start gap-3 ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                        onClick={() => setSelectedAddressId(addr.id)}
                                    >
                                        <div className={`custom-radio mt-1 flex-shrink-0 ${selectedAddressId === addr.id ? 'border-success' : ''}`}></div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <span className="fw-bold">{addr.name}</span>
                                                <span className="text-muted small">| {addr.phone}</span>
                                                {addr.default && <Badge bg="success" className="ms-auto">Mặc định</Badge>}
                                                <Badge bg="light" text="dark" className="border ms-2">{addr.type}</Badge>
                                            </div>
                                            <p className="text-muted small mb-0">{addr.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Row className="g-3 animate-fade-in">
                                <Col md={6}>
                                    <FloatingLabel controlId="fullName" label={<><FaUser className="me-2"/>Họ và tên</>}>
                                        <Form.Control type="text" placeholder="Nguyễn Văn A" />
                                    </FloatingLabel>
                                </Col>
                                <Col md={6}>
                                    <FloatingLabel controlId="phone" label={<><FaPhoneAlt className="me-2"/>Số điện thoại</>}>
                                        <Form.Control type="tel" placeholder="0901234567" />
                                    </FloatingLabel>
                                </Col>
                                <Col md={12}>
                                    <FloatingLabel controlId="email" label={<><FaEnvelope className="me-2"/>Email (để nhận hóa đơn)</>}>
                                        <Form.Control type="email" placeholder="name@example.com" />
                                    </FloatingLabel>
                                </Col>
                                <Col md={12}>
                                    <FloatingLabel controlId="address" label={<><FaMapMarkerAlt className="me-2"/>Địa chỉ nhận hàng</>}>
                                        <Form.Control type="text" placeholder="Số nhà, đường, phường..." />
                                    </FloatingLabel>
                                </Col>
                                <Col md={12}>
                                    <FloatingLabel controlId="note" label="Ghi chú đơn hàng (Tùy chọn)">
                                        <Form.Control as="textarea" placeholder="Ghi chú" style={{ height: '100px' }} />
                                    </FloatingLabel>
                                </Col>
                            </Row>
                        )}
                    </Card.Body>
                </Card>

                {/* 2. PHƯƠNG THỨC THANH TOÁN */}
                <Card className="border-0 shadow-sm mb-4 mb-lg-0">
                    <Card.Body className="p-4">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2">
                            <span className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 30, height: 30, fontSize: '0.9rem'}}>2</span>
                            Phương thức thanh toán
                        </h5>

                        <div className="d-flex flex-column gap-3">
                            <div 
                                className={`payment-card p-3 d-flex align-items-center justify-content-between ${paymentMethod === 'cod' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('cod')}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-light p-2 rounded text-success"><FaMoneyBillWave size={24}/></div>
                                    <div>
                                        <div className="fw-bold">Thanh toán khi nhận hàng (COD)</div>
                                        <div className="small text-muted">Thanh toán tiền mặt cho shipper</div>
                                    </div>
                                </div>
                                <div className="custom-radio"></div>
                            </div>

                            <div 
                                className={`payment-card p-3 d-flex align-items-center justify-content-between ${paymentMethod === 'banking' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('banking')}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-light p-2 rounded text-primary"><FaUniversity size={24}/></div>
                                    <div>
                                        <div className="fw-bold">Chuyển khoản ngân hàng</div>
                                        <div className="small text-muted">VietQR, Internet Banking</div>
                                    </div>
                                </div>
                                <div className="custom-radio"></div>
                            </div>

                            <div 
                                className={`payment-card p-3 d-flex align-items-center justify-content-between ${paymentMethod === 'momo' ? 'selected' : ''}`}
                                onClick={() => setPaymentMethod('momo')}
                            >
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-light p-2 rounded text-danger"><FaCreditCard size={24}/></div>
                                    <div>
                                        <div className="fw-bold">Ví điện tử</div>
                                        <div className="small text-muted">Momo, ZaloPay, ShopeePay</div>
                                    </div>
                                </div>
                                <div className="custom-radio"></div>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Col>

            {/* RIGHT: ORDER SUMMARY */}
            <Col lg={5}>
                <Card className="border-0 shadow-sm sticky-summary">
                    <Card.Header className="bg-white py-3 border-bottom-0">
                        <h5 className="mb-0 fw-bold">Đơn hàng của bạn ({cartItems.length})</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <div className="px-4 py-2" style={{maxHeight: '300px', overflowY: 'auto'}}>
                            {cartItems.map((item) => (
                                <div key={item.id} className="d-flex gap-3 mb-3">
                                    <div className="position-relative">
                                        <img src={item.image} alt={item.name} className="rounded border" style={{width: 60, height: 60, objectFit: 'cover'}}/>
                                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary border border-light">
                                            {item.quantity}
                                        </span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="text-truncate fw-medium" style={{maxWidth: '200px'}}>{item.name}</div>
                                        <div className="small text-muted">{item.price.toLocaleString()} đ</div>
                                    </div>
                                    <div className="fw-bold">{(item.price * item.quantity).toLocaleString()} đ</div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-light p-4 mt-2">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Tạm tính</span>
                                <span className="fw-bold">{subtotal.toLocaleString()} đ</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3 border-bottom pb-3 border-secondary border-opacity-10">
                                <span className="text-muted">Phí vận chuyển</span>
                                <span>{shippingFee.toLocaleString()} đ</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <span className="fw-bold fs-5">Tổng cộng</span>
                                <div className="text-end">
                                    <div className="fw-bold fs-4 text-success">{total.toLocaleString()} đ</div>
                                    <small className="text-muted">(Đã bao gồm VAT)</small>
                                </div>
                            </div>

                            <Button 
                                variant="success" 
                                size="lg" 
                                className="w-100 rounded-pill fw-bold shadow-sm py-3 text-uppercase"
                                onClick={handlePlaceOrder}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : 'Đặt hàng ngay'}
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;