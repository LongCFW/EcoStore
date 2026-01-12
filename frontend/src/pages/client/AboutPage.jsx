import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaLeaf, FaUsers, FaGlobeAsia, FaAward, FaQuoteLeft } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../../assets/styles/pages.css';

const AboutPage = () => {
  return (
    <div className="bg-white">
      {/* 1. Hero Banner */}
      <div className="position-relative py-5 mb-5 text-center text-white" 
           style={{
               backgroundImage: 'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80")',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed' // Hiệu ứng parallax nhẹ
           }}>
        <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
        <Container className="position-relative z-1 py-5">
          <h1 className="display-3 fw-bold mb-3">Câu Chuyện Của EcoStore</h1>
          <p className="lead fw-light">
            Từ niềm đam mê thực phẩm sạch đến hành trình kiến tạo lối sống xanh.
          </p>
        </Container>
      </div>

      <Container className="mb-5">
        {/* 2. FOUNDER STORY */}
        <div className="founder-card p-4 p-lg-5 mb-5">
            <Row className="align-items-center">
                <Col lg={5} className="mb-4 mb-lg-0">
                    {/* Ảnh Founder (Giả lập) */}
                    <img 
                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80" 
                        alt="Anh Long Founder" 
                        className="founder-img shadow-lg"
                    />
                </Col>
                <Col lg={7}>
                    <div className="ps-lg-4">
                        <h5 className="text-success fw-bold text-uppercase mb-2">Nhà Sáng Lập</h5>
                        <h2 className="display-6 fw-bold mb-4">Xin chào, tôi là Long</h2>
                        <div className="mb-4">
                            <FaQuoteLeft className="text-success opacity-25 display-3 float-start me-3" />
                            <p className="text-muted fs-5 fst-italic">
                                "Cách đây 5 năm, khi nhìn thấy những bãi rác nhựa khổng lồ và thực phẩm bẩn tràn lan, tôi tự hỏi mình có thể làm gì? 
                                EcoStore không chỉ là nơi bán hàng, đó là giấc mơ của tôi về một Việt Nam xanh hơn, nơi mọi gia đình đều được sử dụng những sản phẩm an toàn, minh bạch nguồn gốc."
                            </p>
                        </div>
                        <p className="text-muted">
                            Hành trình khởi nghiệp đơn độc nhưng đầy đam mê. Tôi đã đi đến từng nông trại ở Đà Lạt, Mộc Châu để tận tay kiểm tra chất lượng đất, nguồn nước. 
                            Mỗi sản phẩm trên kệ hàng EcoStore đều là tâm huyết và lời cam kết của cá nhân tôi với sức khỏe của bạn.
                        </p>
                        <div className="mt-4 pt-3 border-top">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/e/e4/Signature_sample.svg" alt="Signature" style={{height: '40px', opacity: 0.6}} />
                            <p className="fw-bold mt-2">Anh Long - CEO & Founder</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

        {/* 3. TIMELINE & MISSION */}
        <Row className="g-5 mb-5">
            <Col lg={6}>
                <h3 className="fw-bold mb-4 text-success">Hành Trình Phát Triển</h3>
                <div className="ps-2">
                    <div className="timeline-item">
                        <h5 className="fw-bold">2020: Khởi Đầu</h5>
                        <p className="text-muted small">Cửa hàng nhỏ đầu tiên rộng 20m2 tại TP.HCM với chỉ 10 mã sản phẩm rau củ.</p>
                    </div>
                    <div className="timeline-item">
                        <h5 className="fw-bold">2022: Mở Rộng</h5>
                        <p className="text-muted small">Mở rộng sang các sản phẩm gia dụng xanh (Zero Waste). Đạt mốc 5.000 khách hàng thân thiết.</p>
                    </div>
                    <div className="timeline-item">
                        <h5 className="fw-bold">2025: Hệ Sinh Thái</h5>
                        <p className="text-muted small">Ra mắt nền tảng EcoStore Online. Hợp tác với hơn 50 nông trại hữu cơ trên toàn quốc.</p>
                    </div>
                </div>
            </Col>
            <Col lg={6}>
                <h3 className="fw-bold mb-4 text-success">Giá Trị Cốt Lõi</h3>
                <Row className="g-4">
                    <Col xs={6}>
                        <div className="text-center p-4 bg-light rounded-4 h-100">
                            <FaLeaf className="text-success fs-1 mb-3"/>
                            <h6 className="fw-bold">Tận Tâm</h6>
                            <p className="small text-muted mb-0">Phục vụ từ trái tim</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="text-center p-4 bg-light rounded-4 h-100">
                            <FaGlobeAsia className="text-primary fs-1 mb-3"/>
                            <h6 className="fw-bold">Bền Vững</h6>
                            <p className="small text-muted mb-0">Vì tương lai xanh</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="text-center p-4 bg-light rounded-4 h-100">
                            <FaAward className="text-warning fs-1 mb-3"/>
                            <h6 className="fw-bold">Chất Lượng</h6>
                            <p className="small text-muted mb-0">Cam kết 100%</p>
                        </div>
                    </Col>
                    <Col xs={6}>
                        <div className="text-center p-4 bg-light rounded-4 h-100">
                            <FaUsers className="text-info fs-1 mb-3"/>
                            <h6 className="fw-bold">Cộng Đồng</h6>
                            <p className="small text-muted mb-0">Kết nối & Sẻ chia</p>
                        </div>
                    </Col>
                </Row>
            </Col>
        </Row>

        {/* 4. GOOGLE MAP API (IFRAME) */}
        <div className="mb-5">
            <h3 className="fw-bold mb-4 text-center">Ghé Thăm Cửa Hàng</h3>
            <div className="map-container position-relative">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4946681007846!2d106.69976391474886!3d10.773374292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a4b40df3%3A0x53100569661158fb!2zVHLGsOG7nW5nIENhbyDEkOG6s25nIEvhu7kgdGh14bqtdCBDYW8gVGjhuq9uZw!5e0!3m2!1svi!2s!4v1642672345678!5m2!1svi!2s" 
                    width="100%" 
                    height="450" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Google Map"
                ></iframe>
                
                {/* Info Card Overlay trên Map */}
                <Card className="position-absolute top-0 start-0 m-4 shadow-lg border-0 d-none d-md-block" style={{width: '300px', backgroundColor: 'rgba(255,255,255,0.95)'}}>
                    <Card.Body>
                        <h5 className="fw-bold text-success mb-3">Văn Phòng Chính</h5>
                        <p className="small mb-2"><strong>Địa chỉ:</strong> 65 Huỳnh Thúc Kháng, P. Bến Nghé, Q.1, TP.HCM</p>
                        <p className="small mb-2"><strong>Hotline:</strong> 0901 234 567 (Anh Long)</p>
                        <p className="small mb-0"><strong>Giờ mở cửa:</strong> 8:00 - 21:00 (Hàng ngày)</p>
                        <Button variant="success" size="sm" className="w-100 mt-3 rounded-pill">Chỉ đường</Button>
                    </Card.Body>
                </Card>
            </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;