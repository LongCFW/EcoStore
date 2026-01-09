import React from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

const AboutPage = () => {
  return (
    <>
      {/* 1. HERO BANNER PARALLAX */}
      <div
        className="about-hero"
        style={{
          backgroundImage:
            'url("https://placehold.co/1920x600/1B5E20/FFFFFF?text=Eco+Story")',
        }}
      >
        <div className="text-center text-white p-5 bg-dark bg-opacity-50 rounded-4 shadow-lg backdrop-blur">
          <h1 className="display-3 fw-bold mb-3">Câu Chuyện EcoStore</h1>
          <p className="lead mb-4">
            Hành trình kiến tạo lối sống xanh bền vững từ năm 2020
          </p>
          <Button
            variant="light"
            size="lg"
            className="rounded-pill px-5 text-success fw-bold"
          >
            Khám Phá Ngay
          </Button>
        </div>
      </div>

      <Container className="py-5">
        {/* 2. SỨ MỆNH & TẦM NHÌN */}
        <Row className="g-4 mb-5">
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm about-card p-4 text-center bg-success text-white">
              <div className="display-4 mb-3">
                <i className="bi bi-globe-americas"></i>
              </div>
              <h3 className="fw-bold">Sứ Mệnh</h3>
              <p>
                Giảm thiểu rác thải nhựa bằng cách cung cấp các giải pháp thay
                thế bền vững, thân thiện với môi trường cho mọi gia đình Việt.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm about-card p-4 text-center bg-white text-dark">
              <div className="display-4 mb-3 text-warning">
                <i className="bi bi-eye"></i>
              </div>
              <h3 className="fw-bold">Tầm Nhìn</h3>
              <p>
                Trở thành thương hiệu số 1 về lối sống xanh tại Đông Nam Á,
                truyền cảm hứng cho 1 triệu người thay đổi thói quen tiêu dùng.
              </p>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="h-100 border-0 shadow-sm about-card p-4 text-center bg-dark text-white">
              <div className="display-4 mb-3">
                <i className="bi bi-heart"></i>
              </div>
              <h3 className="fw-bold">Giá Trị Cốt Lõi</h3>
              <p>
                Trung thực về nguồn gốc - Tận tâm với khách hàng - Trách nhiệm
                với cộng đồng và thiên nhiên.
              </p>
            </Card>
          </Col>
        </Row>

        {/* 3. ĐỘI NGŨ (TEAM) */}
        <div className="mb-5 text-center">
          <h2 className="fw-bold text-success mb-5">Đội Ngũ Sáng Lập</h2>
          <Row className="justify-content-center g-4">
            {[1, 2, 3].map((i) => (
              <Col md={3} key={i}>
                <div className="about-card bg-white shadow-sm pb-3">
                  <div className="overflow-hidden mb-3">
                    <img
                      src={`https://placehold.co/300x350/E8F5E9/2E7D32?text=Founder+${i}`}
                      className="w-100 team-member-img"
                      alt="Team"
                    />
                  </div>
                  <h5 className="fw-bold">
                    Nguyễn Văn {String.fromCharCode(64 + i)}
                  </h5>
                  <p className="text-muted small">Co-Founder & CEO</p>
                  <div className="d-flex justify-content-center gap-3 text-success">
                    <i className="bi bi-linkedin"></i>
                    <i className="bi bi-facebook"></i>
                    <i className="bi bi-twitter"></i>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* 4. LIÊN HỆ & BẢN ĐỒ */}
        <Row className="g-0 rounded-4 overflow-hidden shadow-lg">
          <Col lg={6} className="bg-success text-white p-5">
            <h3 className="fw-bold mb-4">Liên Hệ Với Chúng Tôi</h3>
            <p className="mb-4">
              Chúng tôi luôn lắng nghe ý kiến đóng góp của bạn để hoàn thiện hơn
              mỗi ngày.
            </p>

            <div className="d-flex gap-3 mb-3">
              <i className="bi bi-geo-alt-fill fs-4 text-warning"></i>
              <div>
                <h6 className="fw-bold mb-1">Địa chỉ</h6>
                <p className="small opacity-75">
                  Tòa nhà EcoBuilding, Quận 1, TP.HCM
                </p>
              </div>
            </div>
            <div className="d-flex gap-3 mb-3">
              <i className="bi bi-envelope-fill fs-4 text-warning"></i>
              <div>
                <h6 className="fw-bold mb-1">Email</h6>
                <p className="small opacity-75">hello@ecostore.com</p>
              </div>
            </div>

            <Form className="mt-4 p-4 bg-white rounded-3 text-dark">
              <h5 className="fw-bold mb-3">Gửi tin nhắn</h5>
              <Row className="g-2">
                <Col md={6}>
                  <Form.Control
                    placeholder="Tên của bạn"
                    className="bg-light border-0"
                  />
                </Col>
                <Col md={6}>
                  <Form.Control
                    placeholder="Email"
                    className="bg-light border-0"
                  />
                </Col>
                <Col md={12}>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Nội dung cần hỗ trợ..."
                    className="bg-light border-0"
                  />
                </Col>
                <Col md={12}>
                  <Button variant="dark" className="w-100 rounded-pill fw-bold">
                    Gửi Tin Nhắn
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col lg={6}>
            {/* Mock Google Map */}
            <div
              style={{
                height: "100%",
                minHeight: "400px",
                backgroundColor: "#e9ecef",
                position: "relative",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.7003596148008!3d10.77154399232496!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa2726315a8d25403!2sBitexco%20Financial%20Tower!5e0!3m2!1sen!2s!4v1620708575000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Google Map"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AboutPage;
