import React from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok, FaLeaf, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaPaperPlane } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-white pt-5 pb-4" style={{ background: 'linear-gradient(to right, #1a292c, #0f3d28)' }}>
      <Container>
        <Row className="g-4">
          {/* Cột 1: Thông tin thương hiệu */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center gap-2 mb-3">
                <div className="bg-success p-2 rounded-circle d-flex align-items-center justify-content-center">
                    <FaLeaf size={20} />
                </div>
                <h4 className="fw-bold mb-0">EcoStore</h4>
            </div>
            <p className="text-white-50 small mb-4">
              Chúng tôi cam kết mang đến những sản phẩm xanh, sạch và thân thiện với môi trường. 
              Mỗi sản phẩm bạn mua là một đóng góp cho hành tinh xanh.
            </p>
            <div className="d-flex gap-3">
                {[FaFacebookF, FaInstagram, FaYoutube, FaTiktok].map((Icon, idx) => (
                    <a key={idx} href="#" className="btn btn-outline-light rounded-circle p-0 d-flex align-items-center justify-content-center footer-social-icon" style={{width: 36, height: 36}}>
                        <Icon size={14} />
                    </a>
                ))}
            </div>
          </Col>

          {/* Cột 2: Liên kết nhanh */}
          <Col lg={2} md={6}>
            <h5 className="fw-bold mb-4 text-uppercase fs-6 text-success">Khám phá</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="/products" className="text-white-50 text-decoration-none hover-white">Sản phẩm mới</Link></li>
                <li><Link to="/offers" className="text-white-50 text-decoration-none hover-white">Khuyến mãi</Link></li>
                <li><Link to="/about" className="text-white-50 text-decoration-none hover-white">Câu chuyện Eco</Link></li>
                <li><Link to="/blog" className="text-white-50 text-decoration-none hover-white">Blog sống xanh</Link></li>
            </ul>
          </Col>

          {/* Cột 3: Hỗ trợ khách hàng */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4 text-uppercase fs-6 text-success">Hỗ trợ</h5>
            <ul className="list-unstyled d-flex flex-column gap-2">
                <li><Link to="#" className="text-white-50 text-decoration-none hover-white">Chính sách đổi trả</Link></li>
                <li><Link to="#" className="text-white-50 text-decoration-none hover-white">Chính sách bảo mật</Link></li>
                <li><Link to="#" className="text-white-50 text-decoration-none hover-white">Hướng dẫn mua hàng</Link></li>
                <li><Link to="#" className="text-white-50 text-decoration-none hover-white">Liên hệ hợp tác</Link></li>
            </ul>
          </Col>

          {/* Cột 4: Liên hệ & Newsletter */}
          <Col lg={3} md={6}>
            <h5 className="fw-bold mb-4 text-uppercase fs-6 text-success">Liên hệ</h5>
            <ul className="list-unstyled text-white-50 small mb-4">
                <li className="mb-2 d-flex gap-2"><FaMapMarkerAlt className="text-success mt-1"/> 123 Đường Lê Lợi, Q.1, TP.HCM</li>
                <li className="mb-2 d-flex gap-2"><FaPhoneAlt className="text-success mt-1"/> 1900 123 456</li>
                <li className="mb-2 d-flex gap-2"><FaEnvelope className="text-success mt-1"/> contact@ecostore.vn</li>
            </ul>
            
            <h6 className="fw-bold mb-3 mt-4 text-white">Đăng ký nhận tin</h6>
            <InputGroup className="mb-3">
                {/* Input Email cải tiến: Nền tối, chữ trắng, viền rõ */}
                <Form.Control
                    placeholder="Email của bạn..."
                    className="bg-dark text-white border-secondary fs-small footer-input"
                    style={{fontSize: '0.9rem', borderColor: '#4caf50'}} 
                />
                <Button variant="success" className="d-flex align-items-center justify-content-center px-3">
                    <FaPaperPlane />
                </Button>
            </InputGroup>
          </Col>
        </Row>

        <hr className="border-secondary my-4 opacity-25" />

        <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                <p className="text-white-50 small mb-0">© 2025 EcoStore. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-center text-md-end">
                <div className="d-flex gap-2 justify-content-center justify-content-md-end opacity-75">
                    <div className="bg-white rounded px-2 py-1"><small className="fw-bold text-dark" style={{fontSize: '0.7rem'}}>VISA</small></div>
                    <div className="bg-white rounded px-2 py-1"><small className="fw-bold text-dark" style={{fontSize: '0.7rem'}}>MOMO</small></div>
                    <div className="bg-white rounded px-2 py-1"><small className="fw-bold text-dark" style={{fontSize: '0.7rem'}}>COD</small></div>
                </div>
            </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;