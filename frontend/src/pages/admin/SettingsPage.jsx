import React from 'react';
import { Card, Form, Button, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { FaSave } from 'react-icons/fa';

const SettingsPage = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Cấu hình hệ thống</h2>
        <Button variant="primary">
            <FaSave className="me-2" /> Lưu thay đổi
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body>
            <Tabs defaultActiveKey="general" className="mb-4">
                
                {/* 1. Thông tin chung */}
                <Tab eventKey="general" title="Thông tin chung">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tên cửa hàng</Form.Label>
                                <Form.Control type="text" defaultValue="EcoStore" />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Số Hotline</Form.Label>
                                <Form.Control type="text" defaultValue="0901234567" />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                             <Form.Group className="mb-3">
                                <Form.Label>Email liên hệ</Form.Label>
                                <Form.Control type="email" defaultValue="contact@ecostore.com" />
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                             <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ văn phòng</Form.Label>
                                <Form.Control type="text" defaultValue="123 Đường Lê Lợi, Quận 1, TP.HCM" />
                            </Form.Group>
                        </Col>
                    </Row>
                </Tab>

                {/* 2. Cấu hình thanh toán */}
                <Tab eventKey="payment" title="Thanh toán & Vận chuyển">
                    <h6 className="fw-bold mb-3">Phương thức thanh toán</h6>
                    <Form.Check 
                        type="switch"
                        id="cod-switch"
                        label="Thanh toán khi nhận hàng (COD)"
                        defaultChecked
                        className="mb-3"
                    />
                    <Form.Check 
                        type="switch"
                        id="bank-switch"
                        label="Chuyển khoản ngân hàng"
                        defaultChecked
                        className="mb-3"
                    />
                    <Form.Check 
                        type="switch"
                        id="momo-switch"
                        label="Ví điện tử Momo/ZaloPay"
                        defaultChecked
                        className="mb-3"
                    />

                    <hr />
                    <h6 className="fw-bold mb-3">Phí vận chuyển mặc định</h6>
                    <Row>
                        <Col md={4}>
                            <Form.Control type="number" defaultValue={30000} />
                            <Form.Text className="text-muted">VNĐ (Áp dụng cho toàn quốc)</Form.Text>
                        </Col>
                    </Row>
                </Tab>

                {/* 3. Mạng xã hội */}
                <Tab eventKey="social" title="Mạng xã hội">
                    <Form.Group className="mb-3">
                        <Form.Label>Link Facebook Fanpage</Form.Label>
                        <Form.Control type="text" placeholder="https://facebook.com/..." />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Link Instagram</Form.Label>
                        <Form.Control type="text" placeholder="https://instagram.com/..." />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Link Youtube</Form.Label>
                        <Form.Control type="text" placeholder="https://youtube.com/..." />
                    </Form.Group>
                </Tab>

            </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SettingsPage;