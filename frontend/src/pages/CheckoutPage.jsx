import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const CheckoutPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("cod");

  return (
    <Container className="py-5">
      {/* Nút Back */}
      <div className="mb-4">
        <Link
          to="/cart"
          className="text-decoration-none text-muted hover-text-success"
        >
          <i className="bi bi-arrow-left"></i> Quay lại giỏ hàng
        </Link>
      </div>

      <div className="text-center mb-5">
        <h2 className="fw-bold text-success">Thanh Toán An Toàn</h2>
        <div className="d-flex justify-content-center gap-2 text-muted small mt-2">
          <span>Giỏ hàng</span> <i className="bi bi-chevron-right"></i>
          <span className="text-dark fw-bold">Thanh toán</span>{" "}
          <i className="bi bi-chevron-right"></i>
          <span>Hoàn tất</span>
        </div>
      </div>

      <Row>
        <Col lg={7}>
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h5 className="fw-bold mb-3 pb-2 border-bottom">
              <i className="bi bi-geo-alt-fill text-danger"></i> Thông tin nhận
              hàng
            </h5>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label className="small text-muted">Họ và tên</Form.Label>
                <Form.Control
                  defaultValue="Nguyễn Văn A"
                  className="bg-light"
                />
              </Col>
              <Col md={6}>
                <Form.Label className="small text-muted">
                  Số điện thoại
                </Form.Label>
                <Form.Control defaultValue="0901234567" className="bg-light" />
              </Col>
              <Col md={12}>
                <Form.Label className="small text-muted">
                  Địa chỉ nhận hàng
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  defaultValue="123 Đường Số 1, Quận 1, TP.HCM"
                  className="bg-light"
                />
              </Col>
            </Row>
          </div>

          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <h5 className="fw-bold mb-3 pb-2 border-bottom">
              <i className="bi bi-credit-card-2-front-fill text-primary"></i>{" "}
              Phương thức thanh toán
            </h5>
            <div className="d-flex flex-column gap-3">
              {/* Option COD */}
              <label
                className={`d-flex align-items-center p-3 border rounded cursor-pointer ${
                  paymentMethod === "cod"
                    ? "border-success bg-success-subtle"
                    : ""
                }`}
              >
                <Form.Check
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <div className="fw-bold">Thanh toán khi nhận hàng (COD)</div>
                  <div className="small text-muted">
                    Kiểm tra hàng trước khi thanh toán
                  </div>
                </div>
                <i className="bi bi-cash-stack fs-4 text-success"></i>
              </label>

              {/* Option Bank */}
              <label
                className={`d-flex align-items-center p-3 border rounded cursor-pointer ${
                  paymentMethod === "bank"
                    ? "border-success bg-success-subtle"
                    : ""
                }`}
              >
                <Form.Check
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                  className="me-3"
                />
                <div className="flex-grow-1">
                  <div className="fw-bold">Chuyển khoản ngân hàng</div>
                  <div className="small text-muted">
                    Giảm ngay 5% (Tối đa 50k)
                  </div>
                </div>
                <i className="bi bi-bank fs-4 text-primary"></i>
              </label>
            </div>
          </div>
        </Col>

        <Col lg={5}>
          {/* Áp dụng class sidebar-sticky để không đè header */}
          <div className="sidebar-summary">
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom py-3">
                <h5 className="fw-bold m-0">Đơn hàng của bạn</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="d-flex gap-3 mb-3">
                  <div className="position-relative">
                    <img
                      src="https://placehold.co/60x60/E8F5E9/2E7D32"
                      className="rounded"
                      alt="Prod"
                    />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
                      2
                    </span>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold line-clamp-1">
                      Bộ Ống Hút Tre Tự Nhiên
                    </h6>
                    <small className="text-muted">Phân loại: Xanh</small>
                  </div>
                  <div className="ms-auto fw-bold">100.000đ</div>
                </div>

                <hr className="my-3 border-dashed" />

                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tạm tính</span>
                  <span>220.000đ</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-muted">Phí vận chuyển</span>
                  <span className="text-success">Miễn phí</span>
                </div>

                <div className="bg-light p-3 rounded mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">Tổng thanh toán</span>
                    <span className="fw-bold fs-4 text-success">220.000đ</span>
                  </div>
                </div>

                <Button
                  variant="success"
                  size="lg"
                  className="w-100 rounded-pill fw-bold shadow"
                >
                  ĐẶT HÀNG
                </Button>
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
