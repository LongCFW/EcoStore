import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer
      style={{ backgroundColor: "#1B5E20", color: "#E8F5E9" }}
      className="py-5 mt-5"
    >
      <Container>
        <Row className="gy-4">
          <Col md={4}>
            <h4 className="fw-bold text-white mb-3">🌿 EcoStore</h4>
            <p className="opacity-75">
              Chúng tôi cung cấp các sản phẩm thân thiện với môi trường, giúp
              bạn sống xanh và bền vững hơn mỗi ngày.
            </p>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold text-white mb-3">Sản phẩm</h6>
            <ul className="list-unstyled opacity-75">
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Đồ gia dụng
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Mỹ phẩm
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Thời trang
                </a>
              </li>
            </ul>
          </Col>
          <Col md={2}>
            <h6 className="fw-bold text-white mb-3">Hỗ trợ</h6>
            <ul className="list-unstyled opacity-75">
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Chính sách đổi trả
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-reset text-decoration-none">
                  Vận chuyển
                </a>
              </li>
            </ul>
          </Col>
          <Col md={4}>
            <h6 className="fw-bold text-white mb-3">Đăng ký nhận tin</h6>
            <p className="small opacity-75">
              Nhận ưu đãi và mẹo sống xanh hàng tuần.
            </p>
            <div className="d-flex gap-2">
              <input
                type="email"
                className="form-control"
                placeholder="Email của bạn..."
              />
              <button className="btn btn-warning text-dark fw-bold">Gửi</button>
            </div>
          </Col>
        </Row>
        <hr className="border-secondary my-4" />
        <div className="text-center small opacity-50">
          &copy; 2024 EcoStore. Sống Xanh - Sống Khỏe.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
