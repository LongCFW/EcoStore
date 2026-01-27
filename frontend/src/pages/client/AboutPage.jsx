import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form, FloatingLabel } from "react-bootstrap";
import { FaLeaf, FaUsers, FaGlobeAsia, FaAward, FaQuoteLeft, FaPaperPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import contactApi from "../../services/contact.service";
import toast from "react-hot-toast";
import '../../assets/styles/pages.css';

const AboutPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
      name: "",
      email: "",
      subject: "",
      message: ""
  });

  // Tự động điền thông tin nếu user đã đăng nhập
  useEffect(() => {
      if (user) {
          setFormData(prev => ({
              ...prev,
              name: user.name || "",
              email: user.email || ""
          }));
      }
  }, [user]);

  // Xử lý gửi form
  const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!formData.name || !formData.email || !formData.message) {
          toast.error("Vui lòng điền đầy đủ thông tin!");
          return;
      }

      setLoading(true);
      try {
          const res = await contactApi.sendContact(formData);
          if (res.success) {
              toast.success("Tin nhắn đã được gửi! Vui lòng kiểm tra email.");
              // Reset form (giữ lại tên/email nếu là user)
              setFormData({
                  name: user?.name || "",
                  email: user?.email || "",
                  subject: "",
                  message: ""
              });
          }
      } catch (error) {
          console.error(error);
          toast.error("Gửi thất bại. Vui lòng thử lại sau.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-white">
      {/* 1. Hero Banner */}
      <div className="position-relative py-5 mb-5 text-center text-white" 
           style={{
               backgroundImage: 'url("https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80")',
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed'
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
                    <img 
                        src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80" 
                        alt="Anh Long Founder" 
                        className="founder-img shadow-lg rounded-3 w-100 object-fit-cover"
                        style={{height: '400px'}}
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
                        <div className="mt-4 pt-3 border-top">
                            <p className="fw-bold mt-2 text-dark">Anh Long - CEO & Founder</p>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>

        {/* 3. TIMELINE & VALUES */}
        <Row className="g-5 mb-5">
            <Col lg={6}>
                <h3 className="fw-bold mb-4 text-success border-start border-4 border-success ps-3">Hành Trình Phát Triển</h3>
                <div className="ps-2 border-start ms-2">
                    <div className="timeline-item ps-4 pb-4 position-relative">
                        <div className="position-absolute start-0 top-0 translate-middle rounded-circle bg-success border border-white" style={{width: 12, height: 12, marginLeft: -1}}></div>
                        <h5 className="fw-bold">2020: Khởi Đầu</h5>
                        <p className="text-muted small">Cửa hàng nhỏ đầu tiên rộng 20m2 tại TP.HCM với chỉ 10 mã sản phẩm rau củ.</p>
                    </div>
                    <div className="timeline-item ps-4 pb-4 position-relative">
                        <div className="position-absolute start-0 top-0 translate-middle rounded-circle bg-success border border-white" style={{width: 12, height: 12, marginLeft: -1}}></div>
                        <h5 className="fw-bold">2022: Mở Rộng</h5>
                        <p className="text-muted small">Mở rộng sang các sản phẩm gia dụng xanh (Zero Waste). Đạt mốc 5.000 khách hàng thân thiết.</p>
                    </div>
                    <div className="timeline-item ps-4 position-relative">
                        <div className="position-absolute start-0 top-0 translate-middle rounded-circle bg-success border border-white" style={{width: 12, height: 12, marginLeft: -1}}></div>
                        <h5 className="fw-bold">2025: Hệ Sinh Thái</h5>
                        <p className="text-muted small">Ra mắt nền tảng EcoStore Online. Hợp tác với hơn 50 nông trại hữu cơ trên toàn quốc.</p>
                    </div>
                </div>
            </Col>
            <Col lg={6}>
                <h3 className="fw-bold mb-4 text-success border-start border-4 border-success ps-3">Giá Trị Cốt Lõi</h3>
                <Row className="g-4">
                    {[
                        {icon: FaLeaf, title: "Tận Tâm", desc: "Phục vụ từ trái tim", color: "success"},
                        {icon: FaGlobeAsia, title: "Bền Vững", desc: "Vì tương lai xanh", color: "primary"},
                        {icon: FaAward, title: "Chất Lượng", desc: "Cam kết 100%", color: "warning"},
                        {icon: FaUsers, title: "Cộng Đồng", desc: "Kết nối & Sẻ chia", color: "info"}
                    ].map((item, index) => (
                        <Col xs={6} key={index}>
                            <div className="text-center p-4 bg-light rounded-4 h-100 hover-top transition-all shadow-sm border-0">
                                <item.icon className={`text-${item.color} fs-1 mb-3`}/>
                                <h6 className="fw-bold">{item.title}</h6>
                                <p className="small text-muted mb-0">{item.desc}</p>
                            </div>
                        </Col>
                    ))}
                </Row>
            </Col>
        </Row>
      </Container>

      {/* 4. NEW: CONTACT SECTION (ĐÃ THÊM LOGIC) */}
      <div className="bg-light py-5 mb-5">
        <Container>
            <Row className="g-5 align-items-center">
                {/* Contact Info */}
                <Col lg={5}>
                    <h2 className="fw-bold text-success mb-3">Liên Hệ & Hỗ Trợ</h2>
                    <p className="text-muted mb-4">
                        Bạn có thắc mắc về sản phẩm, đơn hàng hay muốn hợp tác kinh doanh? 
                        Đừng ngần ngại gửi tin nhắn, chúng tôi sẽ phản hồi qua email sớm nhất.
                    </p>
                    
                    <div className="d-flex flex-column gap-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><FaMapMarkerAlt size={20}/></div>
                                <div>
                                    <h6 className="fw-bold mb-0">Địa chỉ</h6>
                                    <small className="text-muted">65 Huỳnh Thúc Kháng, Q.1, TP.HCM</small>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><FaPhoneAlt size={20}/></div>
                                <div>
                                    <h6 className="fw-bold mb-0">Hotline</h6>
                                    <small className="text-muted">0901 234 567 (Anh Long)</small>
                                </div>
                            </Card.Body>
                        </Card>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="d-flex align-items-center gap-3">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success"><FaEnvelope size={20}/></div>
                                <div>
                                    <h6 className="fw-bold mb-0">Email</h6>
                                    <small className="text-muted">contact@ecostore.vn</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </div>
                </Col>

                {/* Contact Form */}
                <Col lg={7}>
                    <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
                        <div className="bg-success p-2"></div>
                        <Card.Body className="p-4 p-lg-5 bg-white">
                            <h4 className="fw-bold mb-4">Gửi thắc mắc</h4>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <FloatingLabel controlId="name" label="Họ tên của bạn" className="mb-3">
                                            <Form.Control 
                                                type="text" 
                                                placeholder="Name" 
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={6}>
                                        <FloatingLabel controlId="email" label="Email liên hệ" className="mb-3">
                                            <Form.Control 
                                                type="email" 
                                                placeholder="name@example.com" 
                                                value={formData.email}
                                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                required
                                            />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <FloatingLabel controlId="subject" label="Tiêu đề (Tùy chọn)" className="mb-3">
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Subject" 
                                        value={formData.subject}
                                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    />
                                </FloatingLabel>

                                <FloatingLabel controlId="message" label="Nội dung tin nhắn..." className="mb-4">
                                    <Form.Control 
                                        as="textarea" 
                                        placeholder="Message" 
                                        style={{ height: '150px' }} 
                                        value={formData.message}
                                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                                        required
                                    />
                                </FloatingLabel>

                                <Button 
                                    type="submit" 
                                    variant="success" 
                                    size="lg" 
                                    className="w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2"
                                    disabled={loading}
                                >
                                    {loading ? 'Đang gửi...' : <><FaPaperPlane /> Gửi tin nhắn</>}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
      </div>

      <Container className="mb-5">
        {/* 5. GOOGLE MAP API */}
        <div className="mb-5">
            <h3 className="fw-bold mb-4 text-center">Bản Đồ Cửa Hàng</h3>
            <div className="map-container position-relative rounded-4 overflow-hidden shadow-sm">
                <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4945466164723!2d106.69999731480077!3d10.773383292323565!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a3b49e59%3A0xa1bd14e483a602db!2zNjUgSHXhuqduIFRow7pjIEtow6FuZywgQuG6v24gTmdow6ksIFF14bqtbiAxLCBUaMOgbmggcGjhu5EgSOG7kyBDaMOtIE1pbmgsIFZpZXRuYW0!5e0!3m2!1sen!2s!4v1647852345678!5m2!1sen!2s" 
                    width="100%" 
                    height="450" 
                    style={{border:0}} 
                    allowFullScreen="" 
                    loading="lazy"
                    title="Google Map"
                ></iframe>
            </div>
        </div>
      </Container>
    </div>
  );
};

export default AboutPage;