import React from 'react';
import { Row, Col, Form, Button, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { FaSave, FaGlobe, FaLock, FaEnvelope, FaCreditCard, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa';
import '../../assets/styles/admin.css';

const SettingsPage = () => {
  return (
    <div className="animate-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Cấu Hình Hệ Thống</h2>
      </div>

      <div className="table-card p-4">
        <Tabs defaultActiveKey="general" className="mb-4 custom-tabs">
            {/* TAB 1: THÔNG TIN CHUNG */}
            <Tab eventKey="general" title={<><FaGlobe className="me-2"/>Thông tin chung</>}>
                <Row className="g-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">Tên cửa hàng</Form.Label>
                            <Form.Control type="text" defaultValue="EcoStore Vietnam" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">Hotline</Form.Label>
                            <Form.Control type="text" defaultValue="1900 1234" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label className="admin-label">Địa chỉ trụ sở</Form.Label>
                            <Form.Control type="text" defaultValue="Tòa nhà Bitexco, Q1, TP.HCM" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Label className="admin-label">Logo & Favicon</Form.Label>
                        <div className="d-flex gap-3">
                            <div className="p-3 border rounded-3 bg-light text-center" style={{width: 100, cursor: 'pointer'}}>
                                <small className="d-block text-muted">Logo</small>
                                <span className="fs-4 text-success">+</span>
                            </div>
                            <div className="p-3 border rounded-3 bg-light text-center" style={{width: 100, cursor: 'pointer'}}>
                                <small className="d-block text-muted">Favicon</small>
                                <span className="fs-4 text-success">+</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Tab>

            {/* TAB 2: EMAIL & SMTP */}
            <Tab eventKey="email" title={<><FaEnvelope className="me-2"/>Email & SMTP</>}>
                <Row className="g-4">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">SMTP Server</Form.Label>
                            <Form.Control type="text" defaultValue="smtp.gmail.com" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">SMTP Port</Form.Label>
                            <Form.Control type="text" defaultValue="587" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">Email gửi đi</Form.Label>
                            <Form.Control type="email" defaultValue="noreply@ecostore.com" className="admin-input" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label className="admin-label">Mật khẩu ứng dụng</Form.Label>
                            <Form.Control type="password" value="**************" className="admin-input" readOnly />
                        </Form.Group>
                    </Col>
                </Row>
            </Tab>

            {/* TAB 3: THANH TOÁN */}
            <Tab eventKey="payment" title={<><FaCreditCard className="me-2"/>Thanh toán</>}>
                <div className="mb-3 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <FaCreditCard className="text-primary fs-3"/>
                        <div>
                            <h6 className="fw-bold mb-0">Stripe Payment</h6>
                            <small className="text-muted">Thanh toán qua thẻ Visa/Mastercard</small>
                        </div>
                    </div>
                    <Form.Check type="switch" defaultChecked className="fs-5" />
                </div>
                <div className="mb-3 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-danger text-white rounded p-1 fw-bold small">MOMO</div>
                        <div>
                            <h6 className="fw-bold mb-0">Ví MoMo</h6>
                            <small className="text-muted">Cổng thanh toán MoMo QR</small>
                        </div>
                    </div>
                    <Form.Check type="switch" defaultChecked className="fs-5" />
                </div>
                <div className="mb-3 p-3 border rounded-3 d-flex align-items-center justify-content-between bg-white">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-success text-white rounded p-1 fw-bold small">COD</div>
                        <div>
                            <h6 className="fw-bold mb-0">Thanh toán khi nhận hàng</h6>
                            <small className="text-muted">Cash on Delivery</small>
                        </div>
                    </div>
                    <Form.Check type="switch" defaultChecked className="fs-5" />
                </div>
            </Tab>

            {/* TAB 4: MẠNG XÃ HỘI */}
            <Tab eventKey="social" title={<><FaFacebookF className="me-2"/>Mạng xã hội</>}>
                <Row className="g-4">
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label className="admin-label">Facebook Pixel ID</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white text-primary"><FaFacebookF/></InputGroup.Text>
                                <Form.Control type="text" className="admin-input border-start-0" placeholder="Ex: 123456789" />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={12}>
                        <Form.Group>
                            <Form.Label className="admin-label">Google Analytics ID</Form.Label>
                            <InputGroup>
                                <InputGroup.Text className="bg-white text-danger"><FaGoogle/></InputGroup.Text>
                                <Form.Control type="text" className="admin-input border-start-0" placeholder="Ex: G-XXXXXXXX" />
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
            </Tab>
        </Tabs>

        <div className="border-top pt-4 text-end">
            <Button variant="light" className="rounded-pill px-4 me-2">Hủy bỏ</Button>
            <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm">
                <FaSave className="me-2"/> Lưu Cấu Hình
            </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;