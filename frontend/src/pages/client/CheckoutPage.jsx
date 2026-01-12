import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { FaCreditCard, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Dữ liệu giả lập lấy từ Cart
  const cartItems = [
    { id: 1, name: "Bàn chải tre Eco", price: 45000, quantity: 2 },
    { id: 3, name: "Bình giữ nhiệt", price: 199000, quantity: 1 },
  ];
  
  const subtotal = 289000;
  const shippingFee = 30000;
  const total = subtotal + shippingFee;

  return (
    <Container className="py-5">
      <h2 className="fw-bold mb-4 text-center">Thanh Toán</h2>
      <Row>
        {/* Cột Trái: Thông tin giao hàng */}
        <Col lg={7}>
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold">1. Thông tin người nhận</h5>
                </Card.Header>
                <Card.Body>
                    <Form>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label>Họ và tên</Form.Label>
                                <Form.Control type="text" placeholder="Nguyễn Văn A" required />
                            </Col>
                            <Col md={6}>
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control type="text" placeholder="090xxxxxxx" required />
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="email@example.com" required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ nhận hàng</Form.Label>
                            <Form.Control type="text" placeholder="Số nhà, đường, phường, quận..." required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Ghi chú đơn hàng (tùy chọn)</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Col>

        {/* Cột Phải: Đơn hàng & Thanh toán */}
        <Col lg={5}>
            {/* Tóm tắt đơn hàng */}
            <Card className="border-0 shadow-sm mb-4">
                 <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold">2. Đơn hàng của bạn</h5>
                </Card.Header>
                <Card.Body>
                    {cartItems.map((item, idx) => (
                        <div key={idx} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                            <span>{item.name} <small className="text-muted">x{item.quantity}</small></span>
                            <span className="fw-medium">{(item.price * item.quantity).toLocaleString()} đ</span>
                        </div>
                    ))}
                    <div className="d-flex justify-content-between mt-3">
                        <span className="text-muted">Tạm tính</span>
                        <span>{subtotal.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mt-2">
                        <span className="text-muted">Phí vận chuyển</span>
                        <span>{shippingFee.toLocaleString()} đ</span>
                    </div>
                    <div className="d-flex justify-content-between mt-3 pt-3 border-top">
                        <span className="fw-bold fs-5">Tổng cộng</span>
                        <span className="fw-bold fs-5 text-success">{total.toLocaleString()} đ</span>
                    </div>
                </Card.Body>
            </Card>

            {/* Phương thức thanh toán */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white py-3">
                    <h5 className="mb-0 fw-bold">3. Phương thức thanh toán</h5>
                </Card.Header>
                <Card.Body>
                    <Form.Check 
                        type="radio" 
                        name="payment" 
                        id="cod" 
                        label={<><FaMoneyBillWave className="me-2 text-success"/> Thanh toán khi nhận hàng (COD)</>}
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="mb-3"
                    />
                    <Form.Check 
                        type="radio" 
                        name="payment" 
                        id="banking" 
                        label={<><FaUniversity className="me-2 text-primary"/> Chuyển khoản ngân hàng</>}
                        checked={paymentMethod === 'banking'}
                        onChange={() => setPaymentMethod('banking')}
                        className="mb-3"
                    />
                    <Form.Check 
                        type="radio" 
                        name="payment" 
                        id="momo" 
                        label={<><FaCreditCard className="me-2 text-danger"/> Ví MoMo / ZaloPay</>}
                        checked={paymentMethod === 'momo'}
                        onChange={() => setPaymentMethod('momo')}
                    />
                </Card.Body>
            </Card>
            
            <Button variant="success" size="lg" className="w-100 fw-bold text-uppercase">
                Đặt hàng ngay
            </Button>
            <div className="text-center mt-3">
                <Link to="/cart" className="text-decoration-none small text-muted">Quay lại giỏ hàng</Link>
            </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;