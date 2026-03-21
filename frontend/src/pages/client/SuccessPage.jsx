import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaCheckCircle, FaHome, FaBoxOpen } from 'react-icons/fa';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import orderApi from '../../services/order.service';
import '../../assets/styles/cart-checkout.css';

const SuccessPage = () => {
    const location = useLocation();
    const [searchParams] = useSearchParams();

    // Lấy state từ navigate (COD) hoặc null nếu từ PayOS về
    const [orderData, setOrderData] = useState(location.state?.order || null);
    
    // Nếu chưa có orderData nhưng trên URL có mã orderCode của PayOS thì bật Loading để đi lấy data
    const [loading, setLoading] = useState(!orderData && !!searchParams.get('orderCode'));

    useEffect(() => {
        window.scrollTo(0, 0);

        const payosOrderCode = searchParams.get('orderCode');

        // NẾU KHÔNG CÓ STATE (Do PayOS redirect về) -> Tự động gọi API hỏi thăm Backend
        if (!orderData && payosOrderCode) {
            const fetchOrderDetails = async () => {
                try {
                    const res = await orderApi.getMyOrders();
                    if (res.success) {
                        // Mò trong danh sách đơn hàng xem đơn nào có payosOrderCode khớp với URL
                        const foundOrder = res.data.find(o => o.payosOrderCode === Number(payosOrderCode));
                        if (foundOrder) {
                            setOrderData(foundOrder);
                        }
                    }
                } catch (error) {
                    console.error("Lỗi đồng bộ đơn hàng từ PayOS:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchOrderDetails();
        } else {
            setLoading(false);
        }
    }, [orderData, searchParams]);

    // Màn hình chờ chớp nhoáng lúc vừa từ PayOS văng về
    if (loading) {
        return (
            <Container className="py-5 text-center min-vh-100 d-flex flex-column justify-content-center align-items-center">
                <Spinner animation="border" variant="success" />
                <p className="mt-3 text-muted fw-medium">Đang đồng bộ dữ liệu giao dịch...</p>
            </Container>
        );
    }

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
                        <Card className="border-0 shadow-sm text-center p-5 rounded-4 animate-fade-in">
                            <div className="mb-4 text-success">
                                <FaCheckCircle size={80} />
                            </div>
                            <h2 className="fw-bold mb-3">Đặt hàng thành công!</h2>
                            <p className="text-muted mb-4">
                                Cảm ơn bạn đã mua sắm tại EcoStore.<br/>
                                Mã đơn hàng của bạn là: <span className="fw-bold text-dark">{orderData?.orderNumber || "Đang cập nhật..."}</span>
                            </p>
                            
                            <div className="bg-light p-3 rounded-3 mb-4 text-start border border-success border-opacity-10">
                                <div className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                    <span className="text-muted">Phương thức thanh toán:</span>
                                    <span className="fw-bold">
                                        {/* Logic hiển thị đúng tên phương thức */}
                                        {orderData?.paymentMethod === 'banking' || searchParams.get('status') === 'PAID' 
                                            ? 'Chuyển khoản ngân hàng (VietQR)' 
                                            : 'Thanh toán khi nhận hàng (COD)'}
                                    </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="text-muted">Tổng thanh toán:</span>
                                    <span className="fw-bold text-success fs-4">
                                        {orderData?.totalAmount_cents?.toLocaleString() || 0} đ
                                    </span>
                                </div>
                            </div>
                            
                            <div className="d-flex gap-3 justify-content-center">
                                <Button as={Link} to="/" variant="outline-secondary" className="rounded-pill px-4 hover-scale">
                                    <FaHome className="me-2"/> Trang chủ
                                </Button>
                                {/* Trỏ link thẳng vào tab Quản lý đơn hàng */}
                                <Button as={Link} to="/profile?tab=orders" variant="success" className="rounded-pill px-4 shadow-sm hover-scale">
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