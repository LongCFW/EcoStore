import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Accordion, Badge, Modal, OverlayTrigger, Tooltip, InputGroup, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductPage = () => {
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [wishlist, setWishlist] = useState([2, 5]);

  // FIX: Khởi tạo dữ liệu 1 lần duy nhất bằng useState
  const [products] = useState(() => {
    const list = [];
    const names = ['Ống Hút Tre', 'Túi Vải Canvas', 'Bình Giữ Nhiệt', 'Xà Phòng Organic', 'Bàn Chải Tre', 'Hộp Cơm Lúa Mạch', 'Ly Sứ', 'Khăn Tay', 'Nến Thơm', 'Túi Lọc Trà'];
    for (let i = 1; i <= 20; i++) {
        list.push({
            id: i,
            name: `${names[i % names.length]} ${i}`,
            price: `${(Math.floor(Math.random() * 20) + 5) * 10}.000 đ`,
            oldPrice: i % 3 === 0 ? '500.000 đ' : null,
            img: `https://placehold.co/300x300/${i%2===0 ? 'E8F5E9' : 'F1F8E9'}/2E7D32?text=Product+${i}`,
            rating: Math.floor(Math.random() * 2) + 3,
            isNew: i < 5,
            sale: i % 4 === 0 ? '-15%' : null,
            sold: Math.floor(Math.random() * 500)
        });
    }
    return list;
  });

  const toggleWishlist = (id) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  return (
    <Container className="py-5">
        {/* Banner Header */}
        <div className="bg-light p-5 rounded-4 mb-5 text-center position-relative overflow-hidden shadow-sm" 
             style={{backgroundImage: 'url("https://placehold.co/1200x300/E8F5E9/2E7D32?text=Eco+Store+Collection")', backgroundSize: 'cover'}}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-white opacity-75"></div>
            <div className="position-relative z-1">
                <Badge bg="success" className="mb-2">Bộ Sưu Tập Mới</Badge>
                <h1 className="fw-bold text-success display-5">Cửa Hàng Xanh</h1>
                <p className="lead text-dark m-0">Hơn 500+ sản phẩm bền vững đang chờ bạn khám phá</p>
            </div>
        </div>

        <Row>
            {/* --- SIDEBAR BỘ LỌC PRO --- */}
            <Col lg={3} className="mb-4">
                <div className="p-4 border rounded-3 shadow-sm bg-white sticky-top" style={{ top: '100px', zIndex: 1000 }}>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h5 className="fw-bold m-0"><i className="bi bi-sliders"></i> Bộ Lọc</h5>
                        <small className="text-success cursor-pointer fw-bold hover-underline">Xóa tất cả</small>
                    </div>

                    <InputGroup className="mb-4">
                        <Form.Control placeholder="Tìm sản phẩm..." className="border-end-0 border-success" />
                        <InputGroup.Text className="bg-white border-start-0 border-success"><i className="bi bi-search text-success"></i></InputGroup.Text>
                    </InputGroup>
                    
                    <Accordion defaultActiveKey={['0', '1', '2']} flush alwaysOpen>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>Danh Mục</Accordion.Header>
                            <Accordion.Body>
                                <ul className="list-unstyled mb-0">
                                    {['Đồ gia dụng (120)', 'Mỹ phẩm (85)', 'Thời trang (50)', 'Quà tặng (30)', 'Văn phòng phẩm (25)'].map((cat, i) => (
                                        <li key={i} className="d-flex justify-content-between align-items-center mb-2">
                                            <Form.Check type="checkbox" label={cat.split(' (')[0]} id={`cat-${i}`} />
                                            <span className="text-muted small">{cat.split(' (')[1].replace(')', '')}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>Khoảng Giá</Accordion.Header>
                            <Accordion.Body>
                                <Form.Range className="mb-3" />
                                <div className="d-flex gap-2 align-items-center">
                                    <Form.Control size="sm" placeholder="0" className="text-center" />
                                    <span>-</span>
                                    <Form.Control size="sm" placeholder="1.000k" className="text-center" />
                                </div>
                                <Button variant="outline-success" size="sm" className="w-100 mt-2">Áp dụng</Button>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>Chất Liệu</Accordion.Header>
                            <Accordion.Body>
                                {['Tre / Gỗ', 'Vải Canvas', 'Inox 304', 'Thủy tinh', 'Lúa mạch'].map((mat, i) => (
                                    <Form.Check key={i} type="checkbox" label={mat} className="mb-2" />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                         <Accordion.Item eventKey="3">
                            <Accordion.Header>Đánh Giá</Accordion.Header>
                            <Accordion.Body>
                                {[5, 4, 3].map(star => (
                                    <Form.Check key={star} type="checkbox" id={`star-${star}`} className="mb-2" label={
                                        <span className="text-warning small">
                                            {'★'.repeat(star)}{'☆'.repeat(5-star)} <span className="text-muted text-dark ms-1">Trở lên</span>
                                        </span>
                                    } />
                                ))}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </div>
            </Col>

            {/* --- LƯỚI SẢN PHẨM --- */}
            <Col lg={9}>
                {/* Toolbar */}
                <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
                    <span className="text-muted fw-bold">Hiển thị 20/500 sản phẩm</span>
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted d-none d-md-inline">Sắp xếp:</span>
                        <Form.Select size="sm" style={{ width: '180px' }} className="border-success">
                            <option>Phổ biến nhất</option>
                            <option>Mới nhất</option>
                            <option>Giá tăng dần</option>
                            <option>Giá giảm dần</option>
                        </Form.Select>
                    </div>
                </div>

                <Row>
                    {products.map((product, idx) => (
                        <React.Fragment key={product.id}>
                            {/* Chèn Banner quảng cáo sau sản phẩm thứ 8 */}
                            {idx === 8 && (
                                <Col xs={12} className="mb-4">
                                    <div className="promo-banner-grid p-4 d-flex align-items-center justify-content-between shadow-sm">
                                        <div>
                                            <Badge bg="warning" text="dark" className="mb-2">Khuyến mãi HOT</Badge>
                                            <h3 className="fw-bold mb-1">Combo Zero Waste</h3>
                                            <p className="m-0 text-white-50">Mua 1 bộ Kit - Tặng ngay túi Tote</p>
                                        </div>
                                        <Button variant="light" className="text-success fw-bold rounded-pill px-4">Xem Ngay</Button>
                                    </div>
                                </Col>
                            )}

                            <Col md={4} sm={6} className="mb-4">
                                <Card className="h-100 shadow-sm product-card border-0 position-relative group">
                                    {/* Badges */}
                                    <div className="position-absolute top-0 start-0 m-3 z-2 d-flex flex-column gap-2">
                                        {product.isNew && <Badge bg="success" className="shadow-sm">Mới</Badge>}
                                        {product.sale && <Badge bg="danger" className="shadow-sm">{product.sale}</Badge>}
                                    </div>

                                    {/* Image Wrapper & Action Overlay */}
                                    <div className="product-img-wrapper position-relative rounded-top" style={{height: '260px'}}>
                                        <Link to={`/product/${product.id}`}>
                                            <Card.Img variant="top" src={product.img} className="h-100 w-100" style={{objectFit: 'cover'}} />
                                        </Link>
                                        
                                        <div className="product-action-overlay">
                                            <OverlayTrigger overlay={<Tooltip>{wishlist.includes(product.id) ? 'Bỏ thích' : 'Yêu thích'}</Tooltip>}>
                                                <button 
                                                    className={`action-btn ${wishlist.includes(product.id) ? 'text-danger' : ''}`} 
                                                    onClick={() => toggleWishlist(product.id)}
                                                >
                                                    <i className={`bi ${wishlist.includes(product.id) ? 'bi-heart-fill' : 'bi-heart'}`}></i>
                                                </button>
                                            </OverlayTrigger>

                                            <OverlayTrigger overlay={<Tooltip>Xem nhanh</Tooltip>}>
                                                <button className="action-btn" onClick={() => handleQuickView(product)}>
                                                    <i className="bi bi-eye"></i>
                                                </button>
                                            </OverlayTrigger>

                                            <OverlayTrigger overlay={<Tooltip>Thêm vào giỏ</Tooltip>}>
                                                <button className="action-btn">
                                                    <i className="bi bi-cart-plus"></i>
                                                </button>
                                            </OverlayTrigger>
                                        </div>
                                    </div>

                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <div className="text-warning small">
                                                {'★'.repeat(product.rating)}{'☆'.repeat(5-product.rating)}
                                            </div>
                                            <small className="text-muted" style={{fontSize: '0.75rem'}}>Đã bán {product.sold}</small>
                                        </div>
                                        
                                        <Card.Title as={Link} to={`/product/${product.id}`} className="text-decoration-none text-dark fw-bold fs-6 text-truncate" title={product.name}>
                                            {product.name}
                                        </Card.Title>
                                        
                                        <div className="mt-auto pt-2 d-flex align-items-center justify-content-between">
                                            <div>
                                                <span className="text-success fw-bold fs-5 me-2">{product.price}</span>
                                                {product.oldPrice && <small className="text-muted text-decoration-line-through" style={{fontSize: '0.8rem'}}>{product.oldPrice}</small>}
                                            </div>
                                            <Button variant="outline-success" size="sm" className="rounded-circle border-0" title="Thêm nhanh">
                                                <i className="bi bi-plus-lg"></i>
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </React.Fragment>
                    ))}
                </Row>

                {/* Pagination Pro */}
                <div className="d-flex justify-content-center mt-5">
                    <Pagination className="pagination-success">
                        <Pagination.First />
                        <Pagination.Prev />
                        <Pagination.Item active>{1}</Pagination.Item>
                        <Pagination.Item>{2}</Pagination.Item>
                        <Pagination.Item>{3}</Pagination.Item>
                        <Pagination.Ellipsis />
                        <Pagination.Item>{10}</Pagination.Item>
                        <Pagination.Next />
                        <Pagination.Last />
                    </Pagination>
                </div>
            </Col>
        </Row>

        {/* --- MODAL QUICK VIEW --- */}
        <Modal show={showQuickView} onHide={() => setShowQuickView(false)} size="lg" centered>
            {selectedProduct && (
                <>
                    <Modal.Header closeButton className="border-0 pb-0"></Modal.Header>
                    <Modal.Body className="pt-0 pb-4">
                        <Row>
                            <Col md={6}>
                                <img src={selectedProduct.img} alt={selectedProduct.name} className="w-100 rounded" />
                            </Col>
                            <Col md={6} className="d-flex flex-column justify-content-center">
                                <h3 className="fw-bold">{selectedProduct.name}</h3>
                                <div className="text-danger fw-bold fs-3 my-2">{selectedProduct.price}</div>
                                <p className="text-muted">Mô tả nhanh: Sản phẩm xanh, thân thiện môi trường...</p>
                                <Button variant="success" className="w-100 rounded-pill mt-3">Thêm vào giỏ</Button>
                            </Col>
                        </Row>
                    </Modal.Body>
                </>
            )}
        </Modal>
    </Container>
  );
};

export default ProductPage;