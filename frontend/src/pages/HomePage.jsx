import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Badge,
  Modal,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";

const HomePage = () => {
  // --- STATE QUẢN LÝ ---
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 45, s: 10 });
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);


// Countdown Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { ...prev, h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  // --- MOCK DATA ---
  const flashSaleProducts = [
    {
      id: 101,
      name: "Bàn Chải Tre",
      price: "25.000 đ",
      oldPrice: "40.000 đ",
      img: "https://placehold.co/300x300/E8F5E9/2E7D32?text=Bamboo+Brush",
      sold: 85,
    },
    {
      id: 102,
      name: "Túi Vải Đi Chợ",
      price: "45.000 đ",
      oldPrice: "70.000 đ",
      img: "https://placehold.co/300x300/F1F8E9/2E7D32?text=Eco+Bag",
      sold: 60,
    },
    {
      id: 103,
      name: "Xơ Mướp Tắm",
      price: "15.000 đ",
      oldPrice: "25.000 đ",
      img: "https://placehold.co/300x300/DCEDC8/2E7D32?text=Loofah",
      sold: 92,
    },
    {
      id: 104,
      name: "Ly Giữ Nhiệt",
      price: "199.000 đ",
      oldPrice: "350.000 đ",
      img: "https://placehold.co/300x300/C8E6C9/2E7D32?text=Cup",
      sold: 40,
    },
  ];

  const features = [
    { icon: "bi-truck", title: "Miễn phí vận chuyển", sub: "Đơn hàng từ 500k" },
    {
      icon: "bi-shield-check",
      title: "Bảo hành uy tín",
      sub: "Cam kết 1 đổi 1",
    },
    { icon: "bi-headset", title: "Hỗ trợ 24/7", sub: "Hotline miễn phí" },
    {
      icon: "bi-credit-card",
      title: "Thanh toán an toàn",
      sub: "Đa dạng hình thức",
    },
  ];

  const blogs = [
    {
      id: 1,
      title: "5 Cách Sống Xanh Tại Văn Phòng",
      date: "10/06/2024",
      img: "https://placehold.co/400x250/E8F5E9/2E7D32?text=Green+Office",
    },
    {
      id: 2,
      title: "Tại Sao Nên Dùng Ống Hút Tre?",
      date: "08/06/2024",
      img: "https://placehold.co/400x250/F1F8E9/2E7D32?text=Bamboo+Tips",
    },
    {
      id: 3,
      title: "Phân Loại Rác Đúng Cách",
      date: "05/06/2024",
      img: "https://placehold.co/400x250/DCEDC8/2E7D32?text=Recycle",
    },
  ];

  return (
    <>
      {/* 1. HERO CAROUSEL PRO */}
      <Carousel fade className="mb-0">
        <Carousel.Item interval={4000}>
          <div
            style={{
              height: "600px",
              backgroundImage:
                "url(https://placehold.co/1920x800/2E7D32/FFFFFF?text=Nature+Banner)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="d-flex align-items-center"
          >
            <Container>
              <div
                className="bg-white p-5 rounded shadow-lg opacity-90"
                style={{ maxWidth: "500px" }}
              >
                <Badge bg="warning" text="dark" className="mb-3">
                  Xu hướng 2024
                </Badge>
                <h1 className="display-4 fw-bold text-success mb-3">
                  Sống Xanh Không Khó
                </h1>
                <p className="lead text-dark mb-4">
                  Bộ sưu tập sản phẩm thân thiện môi trường giúp bạn bắt đầu lối
                  sống bền vững ngay hôm nay.
                </p>
                <Button
                  variant="success"
                  size="lg"
                  className="rounded-pill px-5 shadow"
                >
                  Mua Ngay <i className="bi bi-arrow-right"></i>
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
        <Carousel.Item interval={4000}>
          <div
            style={{
              height: "600px",
              backgroundImage:
                "url(https://placehold.co/1920x800/1B5E20/FFFFFF?text=Zero+Waste)",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            className="d-flex align-items-center"
          >
            <Container className="text-end d-flex justify-content-end">
              <div className="text-white" style={{ maxWidth: "600px" }}>
                <h1 className="display-3 fw-bold mb-3">Zero Waste Lifestyle</h1>
                <p className="fs-5 mb-4">
                  Giảm thiểu rác thải nhựa với các sản phẩm tái sử dụng chất
                  lượng cao.
                </p>
                <Button
                  variant="outline-light"
                  size="lg"
                  className="rounded-pill px-5"
                >
                  Khám Phá
                </Button>
              </div>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* 2. INFO BAR (Dịch vụ) */}
      <div
        className="bg-white py-4 shadow-sm position-relative z-1"
        style={{ marginTop: "-40px" }}
      >
        <Container>
          <Row>
            {features.map((item, idx) => (
              <Col
                key={idx}
                md={3}
                sm={6}
                className="d-flex align-items-center gap-3 justify-content-center border-end feature-item"
              >
                <i className={`bi ${item.icon} fs-1 text-success`}></i>
                <div>
                  <h6 className="fw-bold mb-0">{item.title}</h6>
                  <small className="text-muted">{item.sub}</small>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <Container className="py-5">
        {/* 3. FLASH SALE SECTION */}
        <div className="bg-white p-4 rounded shadow-sm border border-danger mb-5">
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 border-bottom pb-3">
            <div className="d-flex align-items-center gap-3">
              <h2 className="fw-bold text-danger m-0 fst-italic">
                <i className="bi bi-lightning-fill"></i> FLASH SALE
              </h2>
              <div className="d-flex gap-2 align-items-center">
                <span className="text-muted">Kết thúc trong:</span>
                <div className="timer-box">
                  {timeLeft.h.toString().padStart(2, "0")}
                </div>{" "}
                :
                <div className="timer-box">
                  {timeLeft.m.toString().padStart(2, "0")}
                </div>{" "}
                :
                <div className="timer-box">
                  {timeLeft.s.toString().padStart(2, "0")}
                </div>
              </div>
            </div>
            <Link
              to="/products"
              className="text-danger fw-bold text-decoration-none"
            >
              Xem tất cả <i className="bi bi-chevron-right"></i>
            </Link>
          </div>

          <Row>
            {flashSaleProducts.map((prod) => (
              <Col key={prod.id} lg={3} md={6} className="mb-3 mb-lg-0">
                <Card className="h-100 border-0 shadow-sm product-card">
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-0 m-2 z-2"
                  >
                    -40%
                  </Badge>
                  <div
                    className="product-img-wrapper position-relative"
                    style={{ height: "200px" }}
                  >
                    <img
                      src={prod.img}
                      className="w-100 h-100 object-fit-cover"
                      alt={prod.name}
                    />
                    <div className="product-action-overlay">
                      <OverlayTrigger overlay={<Tooltip>Xem nhanh</Tooltip>}>
                        <button
                          className="action-btn"
                          onClick={() => handleQuickView(prod)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                      </OverlayTrigger>
                    </div>
                  </div>
                  <Card.Body>
                    <Card.Title className="fs-6 fw-bold">
                      {prod.name}
                    </Card.Title>
                    <div className="d-flex gap-2 align-items-baseline mb-2">
                      <span className="text-danger fw-bold fs-5">
                        {prod.price}
                      </span>
                      <small className="text-muted text-decoration-line-through">
                        {prod.oldPrice}
                      </small>
                    </div>
                    <div className="progress" style={{ height: "6px" }}>
                      <div
                        className="progress-bar bg-danger"
                        style={{ width: `${prod.sold}%` }}
                      ></div>
                    </div>
                    <small className="text-muted mt-1 d-block">
                      Đã bán {prod.sold}
                    </small>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 4. BANNER QUẢNG CÁO ĐÔI */}
        <Row className="mb-5 g-4">
          <Col md={6}>
            <div className="position-relative rounded overflow-hidden shadow-sm group">
              <img
                src="https://placehold.co/800x400/DCEDC8/2E7D32?text=Personal+Care"
                className="w-100 transition-transform hover-scale"
                alt="Banner 1"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y p-4">
                <Badge bg="white" text="success" className="mb-2">
                  Mới về
                </Badge>
                <h3 className="fw-bold text-dark">Chăm Sóc Cá Nhân</h3>
                <p className="text-muted">100% Thuần chay & An toàn</p>
                <Button variant="success" className="rounded-pill btn-sm">
                  Mua ngay
                </Button>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div className="position-relative rounded overflow-hidden shadow-sm group">
              <img
                src="https://placehold.co/800x400/FFECB3/EF6C00?text=Kitchen"
                className="w-100 transition-transform hover-scale"
                alt="Banner 2"
              />
              <div className="position-absolute top-50 start-0 translate-middle-y p-4">
                <Badge bg="white" text="warning" className="mb-2">
                  Bán chạy
                </Badge>
                <h3 className="fw-bold text-dark">Gian Bếp Xanh</h3>
                <p className="text-muted">Dụng cụ nấu ăn bền vững</p>
                <Button
                  variant="warning"
                  text="white"
                  className="rounded-pill btn-sm"
                >
                  Khám phá
                </Button>
              </div>
            </div>
          </Col>
        </Row>

        {/* 5. DANH MỤC TRÒN */}
        <div className="text-center mb-5">
          <h2 className="fw-bold text-success mb-4">Danh Mục Nổi Bật</h2>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {[
              "Túi Xách",
              "Bình Nước",
              "Ống Hút",
              "Mỹ Phẩm",
              "Quà Tặng",
              "Đồ Chơi",
            ].map((cat, i) => (
              <div
                key={i}
                className="text-center group cursor-pointer feature-box p-3 rounded-circle"
                style={{
                  width: "120px",
                  height: "120px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={`https://placehold.co/50x50/2E7D32/FFFFFF?text=${cat.charAt(
                    0
                  )}`}
                  className="rounded-circle mb-2 shadow-sm"
                  alt={cat}
                />
                <span className="fw-bold small text-dark">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 6. PARALLAX BANNER LỚN */}
      </Container>

      <div
        className="parallax-banner py-5 mb-5"
        style={{
          backgroundImage:
            "url(https://placehold.co/1920x600/1B5E20/FFFFFF?text=Save+Earth)",
          height: "400px",
        }}
      >
        <div className="parallax-overlay d-flex align-items-center justify-content-center text-center">
          <Container>
            <h2 className="display-4 fw-bold text-white mb-3">
              Chung Tay Bảo Vệ Hành Tinh Xanh
            </h2>
            <p
              className="lead text-white-50 mb-4 mx-auto"
              style={{ maxWidth: "700px" }}
            >
              Mỗi sản phẩm bạn mua tại EcoStore đều đóng góp 1.000đ vào quỹ
              trồng rừng Việt Nam. Hãy cùng chúng tôi lan tỏa thông điệp sống
              xanh.
            </p>
            <Button
              variant="light"
              size="lg"
              className="rounded-pill px-5 text-success fw-bold"
            >
              Tìm Hiểu Thêm
            </Button>
          </Container>
        </div>
      </div>

      <Container>
        {/* 7. KHÁCH HÀNG NÓI GÌ (TESTIMONIALS) */}
        <div className="mb-5">
          <h2 className="text-center fw-bold text-success mb-4">
            Khách Hàng Nói Gì?
          </h2>
          <Row className="g-4">
            {[1, 2, 3].map((item) => (
              <Col key={item} md={4}>
                <Card className="h-100 border-0 shadow-sm testimonial-card p-3">
                  <div className="quote-icon">“</div>
                  <Card.Body className="position-relative z-1 text-center">
                    <p className="text-muted fst-italic mb-3">
                      "Sản phẩm rất chất lượng, đóng gói hoàn toàn không dùng
                      nilon. Tôi rất ấn tượng với cách phục vụ của shop."
                    </p>
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <img
                        src={`https://placehold.co/50x50/2E7D32/FFF?text=U${item}`}
                        className="rounded-circle"
                        alt="User"
                      />
                      <div className="text-start">
                        <h6 className="fw-bold m-0">
                          Nguyễn Văn {String.fromCharCode(64 + item)}
                        </h6>
                        <small className="text-warning">★★★★★</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 8. BLOG / TIN TỨC */}
        <div className="mb-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-success m-0">Góc Sống Xanh</h2>
            <Link to="#" className="btn btn-outline-success rounded-pill">
              Xem tất cả
            </Link>
          </div>
          <Row className="g-4">
            {blogs.map((blog) => (
              <Col key={blog.id} md={4}>
                <Card className="h-100 blog-card">
                  <div className="overflow-hidden" style={{ height: "200px" }}>
                    <Card.Img
                      variant="top"
                      src={blog.img}
                      className="h-100 w-100 object-fit-cover"
                    />
                  </div>
                  <Card.Body>
                    <small className="text-muted mb-2 d-block">
                      <i className="bi bi-calendar3"></i> {blog.date}
                    </small>
                    <Card.Title className="fw-bold fs-5">
                      {blog.title}
                    </Card.Title>
                    <Card.Text className="text-muted small line-clamp-2">
                      Khám phá những mẹo nhỏ giúp cuộc sống của bạn trở nên thân
                      thiện hơn với môi trường...
                    </Card.Text>
                    <Link
                      to="#"
                      className="text-success fw-bold text-decoration-none small"
                    >
                      Đọc tiếp &rarr;
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* 9. NEWSLETTER SUBSCRIPTION */}
        <div className="bg-light p-5 rounded-3 mb-5 text-center">
          <i className="bi bi-envelope-paper display-4 text-success mb-3 d-block"></i>
          <h3 className="fw-bold">Đăng Ký Nhận Tin</h3>
          <p className="text-muted mb-4">
            Nhận ngay voucher giảm giá 10% cho đơn hàng đầu tiên của bạn!
          </p>
          <div className="mx-auto" style={{ maxWidth: "500px" }}>
            <InputGroup size="lg">
              <Form.Control placeholder="Nhập email của bạn..." />
              <Button variant="success">Đăng Ký</Button>
            </InputGroup>
          </div>
        </div>
      </Container>
      
      {/* --- MODAL QUICK VIEW --- */}
      <Modal
        show={showQuickView}
        onHide={() => setShowQuickView(false)}
        size="lg"
        centered
      >
        {selectedProduct && (
          <Modal.Body className="p-0">
            <div className="d-flex flex-column flex-md-row">
              <div className="w-100 w-md-50">
                <img
                  src={selectedProduct.img}
                  alt={selectedProduct.name}
                  className="w-100 h-100 object-fit-cover rounded-start"
                  style={{ minHeight: "300px" }}
                />
              </div>
              <div className="p-4 w-100 w-md-50 d-flex flex-column justify-content-center">
                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 m-3"
                  onClick={() => setShowQuickView(false)}
                ></button>
                <h4 className="fw-bold mb-2">{selectedProduct.name}</h4>
                <div className="text-danger fw-bold fs-4 mb-3">
                  {selectedProduct.price}
                </div>
                <p className="text-muted small mb-4">
                  Sản phẩm đang nằm trong chương trình Flash Sale với số lượng
                  có hạn. Mua ngay kẻo lỡ!
                </p>
                <Button
                  variant="danger"
                  size="lg"
                  className="w-100 rounded-pill"
                >
                  Thêm Vào Giỏ
                </Button>
              </div>
            </div>
          </Modal.Body>
        )}
      </Modal>
    </>
  );
};

export default HomePage;
