import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Tabs, Tab, Breadcrumb } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaMinus, FaPlus, FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import ProductCard from "../../components/product/ProductCard";
import QuickViewModal from "../../components/product/QuickViewModal"; // Import Modal
import '../../assets/styles/products.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [mainImg, setMainImg] = useState(0); // Index ảnh đang chọn

  // State cho Quick View (Sản phẩm tương tự)
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  // Dữ liệu giả chi tiết sản phẩm
  const product = {
    id: id,
    name: "Bàn chải tre Eco thân thiện môi trường",
    price: 50000,
    salePrice: 45000,
    description: "Bàn chải tre được làm từ 100% tre tự nhiên...",
    category: "Chăm sóc cá nhân",
    sku: "BCT-001",
    rating: 4.8,
    reviews: 120,
    stock: 50,
    images: [
      "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1595855709940-faaa43e36951?auto=format&fit=crop&w=800&q=80",
      "https://via.placeholder.com/800",
      "https://via.placeholder.com/800",
    ],
  };

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <div className="bg-white pb-5">
      {/* Breadcrumb */}
      <div className="bg-light py-3 mb-4">
        <Container>
            <Breadcrumb className="m-0 small">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Trang chủ</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>Sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
            </Breadcrumb>
        </Container>
      </div>

      <Container>
        <Row className="mb-5">
          {/* LEFT: GALLERY */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="border rounded-4 overflow-hidden mb-3 position-relative shadow-sm" style={{height: '450px'}}>
                <img src={product.images[mainImg]} alt="Main" className="w-100 h-100 object-fit-cover" />
                {product.salePrice && <Badge bg="danger" className="position-absolute top-0 start-0 m-3 px-3 py-2">Sale</Badge>}
            </div>
            <div className="d-flex gap-2 justify-content-center">
                {product.images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className={`product-gallery-thumb rounded-3 overflow-hidden ${mainImg === idx ? 'active' : ''}`}
                        style={{width: '80px', height: '80px'}}
                        onClick={() => setMainImg(idx)}
                    >
                        <img src={img} alt="" className="w-100 h-100 object-fit-cover"/>
                    </div>
                ))}
            </div>
          </Col>

          {/* RIGHT: INFO */}
          <Col lg={6}>
            <div className="ps-lg-4">
                <Badge bg="success" className="mb-2 bg-opacity-75">{product.category}</Badge>
                <h2 className="fw-bold mb-3 text-dark">{product.name}</h2>
                
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="text-warning small">
                        {[...Array(5)].map((_,i) => <FaStar key={i} className={i < Math.floor(product.rating) ? "" : "text-muted opacity-25"}/>)}
                        <span className="text-dark fw-bold ms-2">{product.rating}</span>
                    </div>
                    <div className="border-start ps-3 text-muted small">{product.reviews} đánh giá</div>
                    <div className="border-start ps-3 text-muted small">SKU: {product.sku}</div>
                </div>

                <div className="price-tag-detail mb-4">
                    <span className="fs-2 fw-bold me-3 text-success">{product.salePrice?.toLocaleString()} đ</span>
                    {product.salePrice && <span className="text-muted text-decoration-line-through fs-5">{product.price.toLocaleString()} đ</span>}
                </div>

                <p className="text-muted mb-4 opacity-75" style={{lineHeight: '1.8'}}>{product.description}</p>

                {/* Action Box */}
                <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
                    <div className="input-group border rounded-pill overflow-hidden" style={{width: '140px'}}>
                        <button className="btn btn-light border-0" onClick={() => handleQuantity('dec')}><FaMinus size={12}/></button>
                        <input type="text" className="form-control border-0 text-center bg-white fw-bold" value={quantity} readOnly />
                        <button className="btn btn-light border-0" onClick={() => handleQuantity('inc')}><FaPlus size={12}/></button>
                    </div>
                    <Button variant="success" size="lg" className="rounded-pill px-5 fw-bold shadow-sm flex-grow-1">
                        <FaShoppingCart className="me-2"/> Thêm vào giỏ
                    </Button>
                    <Button variant="outline-danger" className="rounded-circle p-0 d-flex align-items-center justify-content-center border-2" style={{width: '48px', height: '48px'}}>
                        <FaHeart />
                    </Button>
                </div>

                {/* Policy Icons */}
                <div className="d-flex gap-4 pt-4 border-top">
                    <div className="d-flex align-items-center gap-2">
                        <FaTruck className="text-success fs-4"/>
                        <span className="small fw-medium">FreeShip <br/> từ 300k</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <FaShieldAlt className="text-success fs-4"/>
                        <span className="small fw-medium">Hàng chính hãng <br/> 100%</span>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                        <FaUndo className="text-success fs-4"/>
                        <span className="small fw-medium">Đổi trả <br/> trong 7 ngày</span>
                    </div>
                </div>
            </div>
          </Col>
        </Row>

        {/* TABS INFO */}
        <Row className="mb-5">
            <Col>
                <Tabs defaultActiveKey="desc" className="mb-4 custom-tabs border-bottom-0 justify-content-center">
                    <Tab eventKey="desc" title="Mô tả chi tiết">
                        <div className="bg-light p-4 rounded-4 shadow-sm" style={{minHeight: '200px'}}>
                            <h5 className="fw-bold mb-3">Đặc điểm nổi bật</h5>
                            <p>Nội dung mô tả chi tiết sản phẩm sẽ nằm ở đây. Hỗ trợ HTML hoặc text dài...</p>
                        </div>
                    </Tab>
                    <Tab eventKey="review" title={`Đánh giá (${product.reviews})`}>
                        <div className="bg-light p-4 rounded-4 shadow-sm text-center text-muted">
                            Chưa có đánh giá nào.
                        </div>
                    </Tab>
                    <Tab eventKey="shipping" title="Chính sách giao hàng">
                        <div className="bg-light p-4 rounded-4 shadow-sm">
                            <p>Giao hàng nội thành trong 24h. Ngoại thành 2-3 ngày.</p>
                        </div>
                    </Tab>
                </Tabs>
            </Col>
        </Row>

        {/* RELATED PRODUCTS */}
        <div className="py-4">
            <h3 className="fw-bold mb-4 text-center">Sản phẩm tương tự</h3>
            <Row xs={2} md={4} className="g-4">
                {[1,2,3,4].map(i => (
                    <Col key={i}>
                        {/* UPDATE: Truyền handleQuickView */}
                        <ProductCard 
                            product={{...product, id: i + 10, name: "Sản phẩm liên quan " + i, image: "https://via.placeholder.com/300"}} 
                            onQuickView={handleQuickView}
                        />
                    </Col>
                ))}
            </Row>
        </div>
      </Container>

      {/* QUICK VIEW MODAL COMPONENT */}
      <QuickViewModal 
        show={showQuickView} 
        handleClose={() => setShowQuickView(false)} 
        product={selectedProduct} 
      />
    </div>
  );
};

export default ProductDetailPage;