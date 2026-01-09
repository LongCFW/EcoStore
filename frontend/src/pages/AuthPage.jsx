import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  FloatingLabel,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle giữa Login và Register
  const [showPass, setShowPass] = useState(false);

  return (
    <div className="auth-container d-flex align-items-center justify-content-center py-5 bg-light">
      <Container>
        <div
          className="bg-white rounded-4 shadow-lg overflow-hidden"
          style={{ minHeight: "600px" }}
        >
          <Row className="g-0 h-100">
            {/* Cột hình ảnh (Trái) */}
            <Col lg={6} className="d-none d-lg-block position-relative">
              <div
                className="auth-banner"
                style={{
                  backgroundImage:
                    'url("https://placehold.co/800x1200/1B5E20/FFFFFF?text=Eco+Life")',
                }}
              >
                <div className="auth-overlay d-flex flex-column justify-content-center p-5 text-white">
                  <h2 className="display-4 fw-bold mb-3">Chào mừng trở lại!</h2>
                  <p className="lead">
                    Tham gia cộng đồng EcoStore để nhận ngay ưu đãi 20% cho đơn
                    hàng đầu tiên.
                  </p>
                  <div className="mt-5">
                    <small className="d-block mb-2 text-white-50">
                      Đã có hơn 10.000+ thành viên tin dùng
                    </small>
                    <div className="d-flex gap-2">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={`https://placehold.co/40x40/E8F5E9/2E7D32?text=U${i}`}
                          className="rounded-circle border border-2 border-white"
                          alt="user"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Col>

            {/* Cột Form (Phải) */}
            <Col
              lg={6}
              className="d-flex flex-column justify-content-center p-5"
            >
              <div className="w-100 mx-auto" style={{ maxWidth: "450px" }}>
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-success mb-2">
                    {isLogin ? "Đăng Nhập" : "Tạo Tài Khoản"}
                  </h3>
                  <p className="text-muted">
                    {isLogin
                      ? "Nhập thông tin để truy cập tài khoản của bạn"
                      : "Điền thông tin bên dưới để bắt đầu hành trình xanh"}
                  </p>
                </div>

                {/* Social Buttons */}
                <div className="d-flex gap-3 mb-4">
                  <button className="btn social-btn flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill">
                    <i className="bi bi-google text-danger"></i> Google
                  </button>
                  <button className="btn social-btn flex-grow-1 py-2 d-flex align-items-center justify-content-center gap-2 rounded-pill">
                    <i className="bi bi-facebook text-primary"></i> Facebook
                  </button>
                </div>

                <div className="text-center position-relative mb-4">
                  <hr className="text-muted" />
                  <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                    Hoặc tiếp tục với email
                  </span>
                </div>

                {/* FORM */}
                <Form>
                  {!isLogin && (
                    <FloatingLabel
                      controlId="floatingName"
                      label="Họ và tên"
                      className="mb-3"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Nguyễn Văn A"
                        className="rounded-3"
                      />
                    </FloatingLabel>
                  )}

                  <FloatingLabel
                    controlId="floatingEmail"
                    label="Địa chỉ Email"
                    className="mb-3"
                  >
                    <Form.Control
                      type="email"
                      placeholder="name@example.com"
                      className="rounded-3"
                    />
                  </FloatingLabel>

                  <InputGroup className="mb-3">
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Mật khẩu"
                    >
                      <Form.Control
                        type={showPass ? "text" : "password"}
                        placeholder="Password"
                        className="rounded-start-3 rounded-end-0 border-end-0"
                      />
                    </FloatingLabel>
                    <Button
                      variant="outline-secondary"
                      className="border-start-0 rounded-end-3"
                      onClick={() => setShowPass(!showPass)}
                    >
                      <i
                        className={`bi ${showPass ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </Button>
                  </InputGroup>

                  {isLogin && (
                    <div className="d-flex justify-content-between mb-4 small">
                      <Form.Check type="checkbox" label="Ghi nhớ đăng nhập" />
                      <Link
                        to="#"
                        className="text-decoration-none text-success fw-bold"
                      >
                        Quên mật khẩu?
                      </Link>
                    </div>
                  )}

                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 rounded-pill fw-bold shadow-sm"
                  >
                    {isLogin ? "Đăng Nhập" : "Đăng Ký Ngay"}
                  </Button>
                </Form>

                <div className="text-center mt-4">
                  <span className="text-muted">
                    {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                  </span>
                  <span
                    className="text-success fw-bold cursor-pointer text-decoration-underline"
                    role="button"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? "Đăng ký miễn phí" : "Đăng nhập ngay"}
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AuthPage;
