import React from 'react';
import { Container, Card, Button, Row, Col } from 'react-bootstrap'; // Import đúng chỗ
import { FaCheckCircle, FaHome, FaBoxOpen } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import '../../assets/styles/cart-checkout.css';

const SuccessPage = () => {
    // Lấy thông tin đơn hàng từ state được truyền qua navigate
    const location = useLocation();
    const orderData = location.state?.order;

    return (
        <div className="bg-light min-vh-100 pb-5">
            <Container className="py-4">
                {/* STEP WIZARD - STEP 3 ACTIVE */}
                <div className="step-wizard mb-5">
                    <div className="step-item completed">
                        <div className="step-count">1</div>
                        <span className="step-text">Giỏ hàng</span>
                    </div>
                    <div className="step-line completed"></div>
                    <div className="step-item completed">
                        <div className="step-count">2</div>
                        <span className="step-text">Thanh toán</span>
                    </div>
                    <div className="step-line completed"></div>
                    <div className="step-item active">
                        <div className="step-count">3</div>
                        <span className="step-text">Hoàn tất</span>
                    </div>
                </div>

                <Row className="justify-content-center">
                    <Col md={8} lg={6}>
                        <Card className="border-0 shadow-sm text-center p-5 rounded-4">
                            <div className="mb-4 text-success">
                                <FaCheckCircle size={80} />
                            </div>
                            <h2 className="fw-bold mb-3">Đặt hàng thành công!</h2>
                            <p className="text-muted mb-4">
                                Cảm ơn bạn đã mua sắm tại EcoStore.<br/>
                                Mã đơn hàng của bạn là: <span className="fw-bold text-dark">{orderData?.orderNumber || "..."}</span>
                            </p>
                            
                            <div className="bg-light p-3 rounded-3 mb-4 text-start">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Phương thức thanh toán:</span>
                                    <span className="fw-bold">{orderData?.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng (COD)' : orderData?.paymentMethod}</span>
                                </div>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted">Tổng thanh toán:</span>
                                    <span className="fw-bold text-success fs-5">{orderData?.totalAmount_cents?.toLocaleString()} đ</span>
                                </div>
                            </div>
                            
                            <div className="d-flex gap-3 justify-content-center">
                                <Button as={Link} to="/" variant="outline-secondary" className="rounded-pill px-4">
                                    <FaHome className="me-2"/> Trang chủ
                                </Button>
                                {/* Chuyển hướng đến Profile Tab Orders (nếu bạn đã làm tab này, nếu chưa thì về profile thường) */}
                                <Button as={Link} to="/profile" variant="success" className="rounded-pill px-4 shadow-sm">
                                    <FaBoxOpen className="me-2"/> Xem đơn hàng
                                </Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default SuccessPage;