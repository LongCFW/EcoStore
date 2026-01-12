import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaLeaf, FaUsers, FaGlobeAsia, FaAward } from "react-icons/fa";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div>
      {/* 1. Hero Banner */}
      <div className="bg-success text-white py-5 text-center mb-5">
        <Container>
          <h1 className="display-4 fw-bold">Câu Chuyện Của EcoStore</h1>
          <p className="lead">
            Hành trình mang lối sống xanh đến từng gia đình Việt.
          </p>
        </Container>
      </div>

      <Container>
        {/* 2. Về chúng tôi - Story */}
        <Row className="align-items-center mb-5">
          <Col md={6}>
            <img
              src="https://via.placeholder.com/600x400"
              alt="Our Story"
              className="img-fluid rounded shadow-sm"
            />
          </Col>
          <Col md={6} className="mt-4 mt-md-0">
            <h2 className="fw-bold text-success mb-3">Sứ Mệnh Của Chúng Tôi</h2>
            <p className="text-muted">
              Được thành lập vào năm 2025, EcoStore ra đời với một khát vọng đơn
              giản:
              <strong>
                {" "}
                "Giảm thiểu rác thải nhựa và bảo vệ hành tinh xanh".{" "}
              </strong>
            </p>
            <p className="text-muted">
              Chúng tôi tin rằng mỗi hành động nhỏ đều mang lại ý nghĩa lớn.
              EcoStore cam kết cung cấp các sản phẩm thân thiện với môi trường,
              có nguồn gốc tự nhiên và bền vững, giúp bạn dễ dàng chuyển đổi
              sang lối sống xanh mà không gặp bất kỳ trở ngại nào.
            </p>
            <Link to="/products">
              <Button variant="outline-success">Khám phá sản phẩm</Button>
            </Link>
          </Col>
        </Row>

        {/* 3. Tại sao chọn EcoStore - Features */}
        <div className="py-5 mb-5 bg-light rounded-3">
          <Container>
            <div className="text-center mb-5">
              <h2 className="fw-bold">Tại Sao Chọn EcoStore?</h2>
            </div>
            <Row className="g-4 text-center">
              <Col md={3}>
                <div className="text-success fs-1 mb-3">
                  <FaLeaf />
                </div>
                <h5>100% Tự Nhiên</h5>
                <p className="small text-muted">
                  Sản phẩm có nguồn gốc thực vật, an toàn cho sức khỏe.
                </p>
              </Col>
              <Col md={3}>
                <div className="text-success fs-1 mb-3">
                  <FaGlobeAsia />
                </div>
                <h5>Bảo Vệ Môi Trường</h5>
                <p className="small text-muted">
                  Quy trình sản xuất và đóng gói hạn chế tối đa nhựa.
                </p>
              </Col>
              <Col md={3}>
                <div className="text-success fs-1 mb-3">
                  <FaUsers />
                </div>
                <h5>Cộng Đồng Lớn</h5>
                <p className="small text-muted">
                  Đồng hành cùng hơn 10.000 khách hàng sống xanh.
                </p>
              </Col>
              <Col md={3}>
                <div className="text-success fs-1 mb-3">
                  <FaAward />
                </div>
                <h5>Chất Lượng Cao</h5>
                <p className="small text-muted">
                  Được kiểm định nghiêm ngặt và đạt chuẩn quốc tế.
                </p>
              </Col>
            </Row>
          </Container>
        </div>

        {/* 4. Đội ngũ - Team (Optional) */}
        <div className="mb-5">
          <h2 className="fw-bold text-center mb-4">Đội Ngũ Sáng Lập</h2>
          <Row xs={1} md={3} className="g-4">
            {[1, 2, 3].map((item) => (
              <Col key={item}>
                <Card className="border-0 shadow-sm text-center h-100">
                  <Card.Body>
                    <img
                      src="https://via.placeholder.com/150"
                      className="rounded-circle mb-3"
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                      alt="Member"
                    />
                    <Card.Title>Nguyễn Văn {item}</Card.Title>
                    <Card.Text className="text-muted small">
                      Co-Founder & CEO
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;
