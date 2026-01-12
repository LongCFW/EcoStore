import React from "react";
import { Container, Row, Col, Button, Carousel, Card, Badge } from "react-bootstrap";
import { FaShippingFast, FaLeaf, FaMedal, FaArrowRight, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import '../../assets/styles/home.css'; // Import CSS riêng

const HomePage = () => {
  // Dữ liệu giả sản phẩm (Trộn lẫn Food và Non-food)
  const products = [
    { id: 1, name: "Cà chua bi hữu cơ (500g)", price: 35000, salePrice: 28000, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80", category: "Rau củ" },
    { id: 2, name: "Bàn chải tre Eco", price: 50000, salePrice: null, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=600&q=80", category: "Đồ dùng" },
    { id: 3, name: "Cải Kale Đà Lạt", price: 45000, salePrice: null, image: "https://images.unsplash.com/photo-1524593166156-312f362cada0?auto=format&fit=crop&w=600&q=80", category: "Rau củ" },
    { id: 4, name: "Túi vải Canvas", price: 120000, salePrice: 99000, image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=600&q=80", category: "Thời trang" },
    { id: 5, name: "Dâu tây Mộc Châu", price: 150000, salePrice: 135000, image: "https://images.unsplash.com/photo-1464965911861-746a04b4b0a9?auto=format&fit=crop&w=600&q=80", category: "Trái cây" },
    { id: 6, name: "Sữa hạt hạnh nhân", price: 80000, salePrice: null, image: "https://images.unsplash.com/photo-1502741224143-90386d7f8c82?auto=format&fit=crop&w=600&q=80", category: "Đồ uống" },
    { id: 7, name: "Xà phòng thảo mộc", price: 65000, salePrice: 50000, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80", category: "Chăm sóc" },
    { id: 8, name: "Hạt Granola ngũ cốc", price: 210000, salePrice: null, image: "https://images.unsplash.com/photo-1517093750596-3536342d2242?auto=format&fit=crop&w=600&q=80", category: "Hạt dinh dưỡng" },
  ];

  // Danh mục nổi bật
  const categories = [
    { name: "Rau Củ", img: "https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?auto=format&fit=crop&w=300&q=80" },
    { name: "Trái Cây", img: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=300&q=80" },
    { name: "Đồ Uống", img: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=300&q=80" },
    { name: "Đồ Gia Dụng", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80" },
    { name: "Chăm Sóc", img: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=300&q=80" },
    { name: "Hạt & Ngũ Cốc", img: "https://images.unsplash.com/photo-1515543904379-3d757afe726e?auto=format&fit=crop&w=300&q=80" },
  ];

  const blogs = [
    { id: 1, title: "5 Cách sống xanh dễ dàng tại nhà", img: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80", date: "20/01/2025" },
    { id: 2, title: "Lợi ích tuyệt vời của rau hữu cơ", img: "https://images.unsplash.com/photo-1595855709940-faaa43e36951?auto=format&fit=crop&w=600&q=80", date: "18/01/2025" },
    { id: 3, title: "Tái chế rác thải nhựa đúng cách", img: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80", date: "15/01/2025" },
  ];

  return (
    <>
      {/* 1. HERO SECTION (CAROUSEL - 5 SLIDES) */}
      <section className="mb-5">
        <Carousel className="hero-section" interval={3000} fade>
            
            {/* Slide 1: Rau củ (Giữ nguyên cái bạn thích) */}
            <Carousel.Item>
                <div className="hero-slide" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1500&q=80")'}}>
                    <div className="hero-overlay">
                        <div className="hero-content animate-slide-up">
                            <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 rounded-pill">100% Organic Food</Badge>
                            <h1 className="display-4 fw-bold mb-3">Thực Phẩm Xanh <br/> Cho Cuộc Sống Lành</h1>
                            <p className="lead mb-4 opacity-75">Tươi ngon từ nông trại đến bàn ăn của bạn. Giảm thiểu rác thải, bảo vệ môi trường.</p>
                            <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 shadow fw-bold">Mua Ngay <FaArrowRight className="ms-2"/></Button>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            {/* Slide 2: Sống Xanh / Zero Waste (Thay mới) */}
            <Carousel.Item>
                <div className="hero-slide" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1605647540924-852290f6b0d5?auto=format&fit=crop&w=1500&q=80")'}}>
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <Badge bg="info" className="mb-3 px-3 py-2 rounded-pill">Zero Waste</Badge>
                            <h1 className="display-4 fw-bold mb-3">Nói Không Với <br/> Rác Thải Nhựa</h1>
                            <p className="lead mb-4 opacity-75">Bộ sưu tập bàn chải tre, ống hút gạo và túi vải thân thiện với mẹ thiên nhiên.</p>
                            <Button as={Link} to="/products" variant="light" size="lg" className="rounded-pill px-5 shadow fw-bold text-success">Khám Phá <FaArrowRight className="ms-2"/></Button>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            {/* Slide 3: Trái Cây Tươi (Mới) */}
            <Carousel.Item>
                <div className="hero-slide" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=1500&q=80")'}}>
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <Badge bg="danger" className="mb-3 px-3 py-2 rounded-pill">Fresh Fruits</Badge>
                            <h1 className="display-4 fw-bold mb-3">Vitamin Tự Nhiên <br/> Mỗi Ngày</h1>
                            <p className="lead mb-4 opacity-75">Trái cây nhập khẩu và đặc sản vùng miền, tươi ngon mọng nước.</p>
                            <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 shadow fw-bold">Xem Ngay <FaArrowRight className="ms-2"/></Button>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            {/* Slide 4: Mỹ Phẩm Thuần Chay (Mới) */}
            <Carousel.Item>
                <div className="hero-slide" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1500&q=80")'}}>
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">Vegan Beauty</Badge>
                            <h1 className="display-4 fw-bold mb-3">Chăm Sóc Cơ Thể <br/> Thuần Chay</h1>
                            <p className="lead mb-4 opacity-75">Xà phòng thảo mộc, tinh dầu tự nhiên an toàn cho làn da nhạy cảm nhất.</p>
                            <Button as={Link} to="/products" variant="light" size="lg" className="rounded-pill px-5 shadow fw-bold text-success">Thử Ngay <FaArrowRight className="ms-2"/></Button>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

            {/* Slide 5: Túi Vải & Thời Trang (Mới) */}
            <Carousel.Item>
                <div className="hero-slide" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=1500&q=80")'}}>
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <Badge bg="secondary" className="mb-3 px-3 py-2 rounded-pill">Eco Fashion</Badge>
                            <h1 className="display-4 fw-bold mb-3">Phong Cách Xanh <br/> Bền Vững</h1>
                            <p className="lead mb-4 opacity-75">Túi Canvas, phụ kiện tái chế - Vừa thời trang vừa bảo vệ môi trường.</p>
                            <Button as={Link} to="/products" variant="success" size="lg" className="rounded-pill px-5 shadow fw-bold">Mua Sắm <FaArrowRight className="ms-2"/></Button>
                        </div>
                    </div>
                </div>
            </Carousel.Item>

        </Carousel>
      </section>

      {/* 2. FEATURES (CAM KẾT) */}
      <section className="mb-5">
        <Container>
            <Row className="g-4">
                {[
                    { icon: <FaLeaf className="fs-1 text-success"/>, title: "100% Tự Nhiên", desc: "Nguồn gốc hữu cơ minh bạch" },
                    { icon: <FaShippingFast className="fs-1 text-primary"/>, title: "Giao Hàng Nhanh", desc: "Miễn phí vận chuyển đơn từ 300k" },
                    { icon: <FaMedal className="fs-1 text-warning"/>, title: "Chất Lượng Cao", desc: "Được kiểm định nghiêm ngặt" },
                ].map((item, idx) => (
                    <Col md={4} key={idx}>
                        <div className="d-flex align-items-center bg-white p-4 rounded-4 shadow-sm h-100 border border-light">
                            <div className="me-3">{item.icon}</div>
                            <div>
                                <h5 className="fw-bold mb-1">{item.title}</h5>
                                <p className="text-muted small mb-0">{item.desc}</p>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
      </section>

      {/* 3. CATEGORIES (DANH MỤC TRÒN) */}
      <section className="mb-5 text-center">
        <Container>
            <h2 className="section-title">Danh Mục Nổi Bật</h2>
            <Row className="justify-content-center g-4">
                {categories.map((cat, idx) => (
                    <Col xs={4} md={2} key={idx}>
                        <div className="category-card">
                            <div className="cat-img-wrapper">
                                <img src={cat.img} alt={cat.name} />
                            </div>
                            <h6 className="fw-bold text-dark mt-3">{cat.name}</h6>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
      </section>

      {/* 4. FLASH SALE / BEST SELLERS (SẢN PHẨM FOOD) */}
      <section className="mb-5 py-5 bg-light rounded-4" style={{backgroundImage: 'linear-gradient(to bottom, #f1f8e9, white)'}}>
        <Container>
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <div className="d-flex align-items-center gap-2 mb-1">
                        <h2 className="fw-bold mb-0 text-danger">Flash Sale 🔥</h2>
                        <Badge bg="danger">Kết thúc sau 12:00</Badge>
                    </div>
                    <p className="text-muted mb-0">Săn deal giá sốc mỗi ngày</p>
                </div>
                <Button variant="outline-danger" className="rounded-pill fw-bold">Xem tất cả</Button>
            </div>
            
            <Row xs={1} md={2} lg={4} className="g-4">
                {products.slice(0, 4).map((product) => (
                    <Col key={product.id}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
        </Container>
      </section>

     {/* 5. PROMO BANNER (VOUCHER CAROUSEL) */}
      <section className="mb-5">
        <Container>
            {/* Sử dụng Carousel cho Banner Voucher */}
            <Carousel controls={true} indicators={false} interval={4000} className="shadow-lg rounded-4 overflow-hidden promo-carousel">
                
                {/* Voucher 1: Giảm 50k (Màu Xanh Đậm) */}
                <Carousel.Item>
                    {/* Thiết lập chiều cao cố định là 350px (hoặc giá trị phù hợp) */}
                    <div className="promo-banner p-5 d-flex align-items-center justify-content-between flex-wrap position-relative" style={{background: 'linear-gradient(135deg, #2e7d32 0%, #004d40 100%)', height: '350px'}}>
                        {/* Nội dung chính: Tăng z-index lên 10 để chắc chắn nằm trên cùng */}
                        <div className="position-relative mb-4 mb-md-0 text-white" style={{zIndex: 10, maxWidth: '600px'}}>
                            <Badge bg="light" text="success" className="mb-3 px-3 py-2 fs-6">Dành cho thành viên mới</Badge>
                            <h2 className="display-5 fw-bold mb-3">Giảm 50k cho đơn hàng đầu tiên</h2>
                            <p className="fs-5 opacity-90 mb-4">Nhập mã <strong className="border-bottom">ECOSTART</strong> khi thanh toán. Đừng bỏ lỡ!</p>
                            <Button variant="light" size="lg" className="rounded-pill text-success fw-bold px-5 shadow-sm promo-btn">Lưu Mã Ngay</Button>
                        </div>
                        
                        {/* Icon trang trí: z-index thấp hơn (1) */}
                        <div className="d-none d-md-block position-absolute end-0 me-5 opacity-25" style={{zIndex: 1, pointerEvents: 'none'}}>
                            <FaLeaf size={180} className="text-white" />
                        </div>
                    </div>
                </Carousel.Item>

                {/* Voucher 2: Freeship (Màu Xanh Dương/Tím) */}
                <Carousel.Item>
                    {/* Thiết lập chiều cao cố định là 350px */}
                    <div className="promo-banner p-5 d-flex align-items-center justify-content-between flex-wrap position-relative" style={{background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)', height: '350px'}}>
                        <div className="position-relative mb-4 mb-md-0 text-white" style={{zIndex: 10, maxWidth: '600px'}}>
                            <Badge bg="warning" text="dark" className="mb-3 px-3 py-2 fs-6">Hot Deal</Badge>
                            <h2 className="display-5 fw-bold mb-3">Miễn Phí Vận Chuyển</h2>
                            <p className="fs-5 opacity-90 mb-4">Nhập mã <strong className="border-bottom">FREESHIP</strong> cho đơn hàng từ 300k. Toàn quốc.</p>
                            <Button variant="warning" size="lg" className="rounded-pill text-dark fw-bold px-5 shadow-sm promo-btn">Lưu Mã Ngay</Button>
                        </div>
                        <div className="d-none d-md-block position-absolute end-0 me-5 opacity-25" style={{zIndex: 1, pointerEvents: 'none'}}>
                            <FaShippingFast size={180} className="text-white" />
                        </div>
                    </div>
                </Carousel.Item>

                {/* Voucher 3: Giảm 20% (Màu Cam/Vàng) */}
                <Carousel.Item>
                    {/* Thiết lập chiều cao cố định là 350px */}
                    <div className="promo-banner p-5 d-flex align-items-center justify-content-between flex-wrap position-relative" style={{background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', height: '350px'}}>
                        <div className="position-relative mb-4 mb-md-0 text-white" style={{zIndex: 10, maxWidth: '600px'}}>
                            <Badge bg="light" text="danger" className="mb-3 px-3 py-2 fs-6">Giờ vàng</Badge>
                            <h2 className="display-5 fw-bold mb-3">Giảm 20% Toàn Sàn</h2>
                            <p className="fs-5 opacity-90 mb-4">Duy nhất hôm nay! Nhập mã <strong className="border-bottom">GOLDENHOUR</strong>.</p>
                            <Button variant="light" size="lg" className="rounded-pill text-danger fw-bold px-5 shadow-sm promo-btn">Mua Ngay</Button>
                        </div>
                        <div className="d-none d-md-block position-absolute end-0 me-5 opacity-25" style={{zIndex: 1, pointerEvents: 'none'}}>
                            <FaClock size={180} className="text-white" />
                        </div>
                    </div>
                </Carousel.Item>

            </Carousel>
        </Container>
      </section>

      {/* 6. GREEN PRODUCTS (SẢN PHẨM ECO) */}
      <section className="mb-5">
        <Container>
            <div className="text-center mb-5">
                <h2 className="section-title">Sống Xanh & Bền Vững</h2>
                <p className="text-muted w-75 mx-auto">Các sản phẩm thay thế nhựa dùng một lần, an toàn cho sức khỏe và môi trường.</p>
            </div>
            <Row xs={1} md={2} lg={4} className="g-4">
                {products.slice(4, 8).map((product) => (
                    <Col key={product.id}>
                        <ProductCard product={product} />
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-5">
                <Button variant="outline-success" size="lg" className="rounded-pill px-5">Xem thêm sản phẩm xanh</Button>
            </div>
        </Container>
      </section>

      {/* 7. BLOG & TIPS */}
      <section className="mb-5 pb-4">
        <Container>
            <h2 className="fw-bold mb-4">Góc Sống Xanh</h2>
            <Row className="g-4">
                {blogs.map(blog => (
                    <Col md={4} key={blog.id}>
                        <Card className="blog-card h-100">
                            <Card.Img variant="top" src={blog.img} className="blog-img" />
                            <Card.Body>
                                <div className="text-muted small mb-2 d-flex align-items-center gap-1">
                                    <FaClock size={12}/> {blog.date}
                                </div>
                                <Card.Title className="fw-bold mb-2 fs-5">{blog.title}</Card.Title>
                                <Card.Text className="text-muted small">
                                    Khám phá những mẹo nhỏ giúp bạn sống xanh hơn mỗi ngày mà không tốn quá nhiều công sức...
                                </Card.Text>
                                <Button variant="link" className="p-0 text-success text-decoration-none fw-bold">Đọc tiếp &rarr;</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
      </section>
    </>
  );
};

export default HomePage;