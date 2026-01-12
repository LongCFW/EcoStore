import React, { useState } from "react";
import { Container, Row, Col, Form, Pagination, Button, Offcanvas, Breadcrumb } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import QuickViewModal from "../../components/product/QuickViewModal"; // Import Modal
import '../../assets/styles/products.css';

const ProductListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  
  // State cho Quick View Modal
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Hàm mở modal
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  // Dữ liệu giả định
  const products = [
    { id: 1, name: "Bàn chải tre Eco", price: 50000, salePrice: 45000, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=600&q=80", category: "Đồ dùng" },
    { id: 2, name: "Túi vải Canvas", price: 120000, salePrice: null, image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=600&q=80", category: "Thời trang" },
    { id: 3, name: "Bình giữ nhiệt", price: 250000, salePrice: 199000, image: "https://images.unsplash.com/photo-1602143407151-51115da92c4a?auto=format&fit=crop&w=600&q=80", category: "Đồ dùng" },
    { id: 4, name: "Xà phòng thảo mộc", price: 80000, salePrice: null, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=600&q=80", category: "Chăm sóc" },
    { id: 5, name: "Cà chua bi hữu cơ", price: 35000, salePrice: 28000, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=600&q=80", category: "Rau củ" },
    { id: 6, name: "Hộp cơm lúa mạch", price: 150000, salePrice: 120000, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80", category: "Đồ gia dụng" },
  ];

  return (
    <div className="bg-light min-vh-100 pb-5">
        {/* --- BANNER HEADER MỚI (ĐẸP & CHUYÊN NGHIỆP) --- */}
        <div className="position-relative py-5 mb-4 text-center text-white" 
             style={{
                 backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
             }}>
            {/* Lớp phủ tối để chữ nổi bật */}
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            
            <Container className="position-relative z-1">
                <h2 className="display-5 fw-bold mb-2">Cửa Hàng Xanh</h2>
                <p className="lead mb-3 opacity-90">Sản phẩm thiên nhiên - Vì sức khỏe của bạn</p>
                {/* <Breadcrumb className="justify-content-center eco-breadcrumb">
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="text-white text-decoration-none">Trang chủ</Breadcrumb.Item>
                    <Breadcrumb.Item active className="text-white fw-bold">Sản phẩm</Breadcrumb.Item>
                </Breadcrumb> */}
            </Container>
        </div>

        <Container>
            <Row>
                {/* SIDEBAR FILTER (Desktop) */}
                <Col lg={3} className="d-none d-lg-block">
                    <ProductFilter />
                </Col>

                {/* PRODUCT CONTENT */}
                <Col lg={9}>
                    {/* Toolbar */}
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="outline-success" className="d-lg-none d-flex align-items-center gap-2" onClick={() => setShowFilter(true)}>
                                <FaFilter /> Lọc
                            </Button>
                            <span className="text-muted d-none d-md-block">Hiển thị <strong>{products.length}</strong> sản phẩm</span>
                        </div>
                        
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted d-none d-md-block small">Sắp xếp:</span>
                            <Form.Select size="sm" style={{ width: "180px", borderRadius: '20px' }}>
                                <option>Mới nhất</option>
                                <option>Bán chạy nhất</option>
                                <option>Giá: Thấp đến Cao</option>
                                <option>Giá: Cao đến Thấp</option>
                            </Form.Select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <Row xs={2} md={3} lg={3} className="g-3 g-md-4">
                        {products.map((product) => (
                            <Col key={product.id}>
                                {/* Truyền hàm handleQuickView vào ProductCard */}
                                <ProductCard product={product} onQuickView={handleQuickView} />
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="d-flex justify-content-center mt-5">
                        <Pagination className="eco-pagination">
                            <Pagination.Prev />
                            <Pagination.Item active>{1}</Pagination.Item>
                            <Pagination.Item>{2}</Pagination.Item>
                            <Pagination.Item>{3}</Pagination.Item>
                            <Pagination.Next />
                        </Pagination>
                    </div>
                </Col>
            </Row>
        </Container>

        {/* OFFCANVAS FILTER (Mobile) */}
        <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="fw-bold text-success"><FaFilter/> Bộ lọc sản phẩm</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ProductFilter />
            </Offcanvas.Body>
        </Offcanvas>

        {/* QUICK VIEW MODAL */}
        <QuickViewModal 
            show={showQuickView} 
            handleClose={() => setShowQuickView(false)} 
            product={selectedProduct} 
        />
    </div>
  );
};

export default ProductListPage;