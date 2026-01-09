import React, { useState } from 'react';
import { Container, Row, Col, Button, Badge, Form, Tabs, Tab, Table, ProgressBar, Breadcrumb, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductDetailPage = () => {
//   const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Mock Main Product
  const product = {
    id: 1,
    name: 'Bộ Bình Giữ Nhiệt Tre & Cốc Sứ Eco Cao Cấp - Limited Edition',
    price: '450.000 đ',
    oldPrice: '600.000 đ',
    rating: 4.8,
    reviews: 215,
    imgs: [
      'https://placehold.co/600x600/E8F5E9/2E7D32?text=Main+Product',
      'https://placehold.co/600x600/F1F8E9/2E7D32?text=Angle+1',
      'https://placehold.co/600x600/C8E6C9/2E7D32?text=Angle+2',
      'https://placehold.co/600x600/A5D6A7/2E7D32?text=Package'
    ]
  };

  // Mock Related Products
  const relatedProducts = Array.from({length: 8}).map((_, i) => ({
      id: i+10,
      name: `Sản Phẩm Gợi Ý ${i+1}`,
      price: '150.000 đ',
      img: `https://placehold.co/200x200/F1F8E9/2E7D32?text=Relate+${i+1}`
  }));

  return (
    <>
      <Container className="py-4">
        <Breadcrumb className="bg-light p-2 rounded mb-4 ps-3">
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
            <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>Cửa hàng</Breadcrumb.Item>
            <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
        </Breadcrumb>

        <Row className="mb-5">
            {/* Gallery */}
            <Col lg={6}>
                <div className="position-relative mb-3 zoom-container bg-white border rounded shadow-sm">
                    <Badge bg="danger" className="position-absolute top-0 start-0 m-3 z-2 px-3 py-2">-25%</Badge>
                    <img src={product.imgs[activeImg]} className="zoom-img w-100" alt="Main" />
                </div>
                <div className="d-flex gap-2 justify-content-center">
                    {product.imgs.map((img, idx) => (
                        <div 
                            key={idx} 
                            className={`product-gallery-thumb rounded overflow-hidden shadow-sm ${activeImg === idx ? 'active' : ''}`}
                            style={{width: '80px', height: '80px'}}
                            onMouseEnter={() => setActiveImg(idx)}
                        >
                            <img src={img} className="w-100 h-100 object-fit-cover" alt="Thumb" />
                        </div>
                    ))}
                </div>
            </Col>

            {/* Info */}
            <Col lg={6} className="ps-lg-5">
                <h2 className="fw-bold text-dark mb-2">{product.name}</h2>
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div className="text-warning"><i className="bi bi-star-fill"></i> {product.rating}</div>
                    <div className="text-muted border-start ps-3">Đã bán: <span className="text-dark fw-bold">1.2k</span></div>
                </div>

                <div className="bg-light p-3 rounded mb-4 d-flex align-items-end gap-3">
                    <h1 className="text-success fw-bold m-0">{product.price}</h1>
                    <span className="text-decoration-line-through text-muted fs-5 mb-1">{product.oldPrice}</span>
                </div>

                <div className="d-flex gap-3 mb-4">
                    <Button variant="outline-success" size="lg" className="w-50 rounded-pill fw-bold">
                        <i className="bi bi-cart-plus"></i> Thêm vào giỏ
                    </Button>
                    <Button variant="success" size="lg" className="w-50 rounded-pill fw-bold text-white shadow">Mua Ngay</Button>
                    
                    <OverlayTrigger overlay={<Tooltip>{isLiked ? 'Bỏ thích' : 'Yêu thích'}</Tooltip>}>
                        <Button 
                            variant="outline-danger" 
                            className="rounded-circle" 
                            style={{width: '50px', height: '50px'}}
                            onClick={() => setIsLiked(!isLiked)}
                        >
                            <i className={`bi ${isLiked ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                        </Button>
                    </OverlayTrigger>
                </div>
                
                 {/* Ưu đãi thêm */}
                 <div className="border rounded p-3 bg-white shadow-sm">
                    <h6 className="fw-bold text-success mb-3"><i className="bi bi-gift-fill"></i> Ưu đãi dành cho bạn</h6>
                    <ul className="list-unstyled mb-0 small">
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Tặng kèm túi vải Canvas trị giá 50k</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Freeship toàn quốc cho đơn từ 500k</li>
                        <li><i className="bi bi-check-circle text-success me-2"></i>Bảo hành 12 tháng chính hãng</li>
                    </ul>
                </div>
            </Col>
        </Row>

        {/* Tab Description */}
        <div className="bg-white rounded shadow-sm p-4 mb-5">
            <Tabs defaultActiveKey="desc" className="mb-4 fw-bold border-bottom-0">
                <Tab eventKey="desc" title="Mô Tả">
                    <p>Sản phẩm được chế tác từ nguyên liệu tự nhiên, an toàn cho sức khỏe và thân thiện với môi trường. Quy trình sản xuất khép kín đảm bảo chất lượng cao nhất.</p>
                </Tab>
                <Tab eventKey="spec" title="Thông Số">
                     <Table striped bordered hover size="sm">
                        <tbody>
                            <tr><td>Chất liệu</td><td>Tre tự nhiên, Inox 304</td></tr>
                            <tr><td>Dung tích</td><td>500ml</td></tr>
                            <tr><td>Trọng lượng</td><td>300g</td></tr>
                        </tbody>
                    </Table>
                </Tab>
                <Tab eventKey="review" title={`Đánh Giá (${product.reviews})`}>
                    <div className="d-flex align-items-center mb-3">
                         <h1 className="text-warning me-3 mb-0">4.8</h1>
                         <div>
                            <div className="text-warning"><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-fill"></i><i className="bi bi-star-half"></i></div>
                            <small className="text-muted">215 đánh giá</small>
                         </div>
                    </div>
                    <ProgressBar variant="success" now={80} label="5 sao" className="mb-2" style={{height: '20px'}} />
                    <ProgressBar variant="success" now={15} label="4 sao" className="mb-2" style={{height: '20px'}} />
                </Tab>
            </Tabs>
        </div>

        {/* --- SECTION: CÓ THỂ BẠN SẼ THÍCH (SLIDER NGANG) --- */}
        <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="fw-bold text-success border-start border-4 border-success ps-3">Có thể bạn sẽ thích</h3>
            </div>
            
            {/* Horizontal Scroll Wrapper - Đảm bảo CSS index.css có class scrolling-wrapper */}
            <div className="scrolling-wrapper">
                {relatedProducts.map(item => (
                    <div className="card-horizontal-item" key={item.id}>
                        <Card className="h-100 shadow-sm border-0 product-card">
                            <div className="position-relative">
                                <Link to={`/product/${item.id}`}>
                                    <Card.Img variant="top" src={item.img} style={{height: '200px', objectFit: 'cover'}} />
                                </Link>
                                <Button 
                                    variant="light" 
                                    className="position-absolute top-0 end-0 m-2 rounded-circle shadow-sm p-0 text-danger"
                                    style={{width: '30px', height: '30px', lineHeight: '30px'}}
                                >
                                    <i className="bi bi-heart"></i>
                                </Button>
                            </div>
                            <Card.Body>
                                <Card.Title className="fs-6 fw-bold text-truncate">{item.name}</Card.Title>
                                <div className="text-success fw-bold">{item.price}</div>
                                <Button variant="outline-primary" size="sm" className="w-100 rounded-pill mt-2">Xem Ngay</Button>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
      </Container>
    </>
  );
};

export default ProductDetailPage;