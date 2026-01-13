import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Pagination, Button, Offcanvas, Breadcrumb, Spinner } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
// import { Link } from "react-router-dom"; // Tạm thời chưa dùng nên comment để không warn
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import QuickViewModal from "../../components/product/QuickViewModal";
import productApi from "../../services/product.service"; // <--- 1. Import Service
import '../../assets/styles/products.css';

const ProductListPage = () => {
  const [showFilter, setShowFilter] = useState(false);
  
  // State cho Quick View Modal
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- 2. STATE QUẢN LÝ DỮ LIỆU TỪ BACKEND ---
  const [products, setProducts] = useState([]); // Chứa danh sách sản phẩm thật
  const [loading, setLoading] = useState(true); // Trạng thái đang tải

  // --- 3. GỌI API KHI TRANG LOAD ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll(); 
        console.log("Response từ Backend:", response); // Log ra để kiểm tra

        // Postman trả về: { success: true, data:Array[...] }
        // Nên phải chọc vào .data để lấy mảng sản phẩm
        const productList = response.data || [];
        // --- QUAN TRỌNG: MAPPING DỮ LIỆU ---
        // Backend trả về mảng 'images', nhưng giao diện cũ dùng 'image' (string)
        // Backend trả về 'price_cents', giao diện cũ dùng 'price'
        // Ta cần biến đổi dữ liệu Backend cho khớp với Frontend cũ để không vỡ giao diện
        const formattedProducts = productList.map(item => ({
          id: item._id, // Mongo dùng _id
          name: item.name,
          // Giả định backend lưu 50000 là 50000, nếu lưu cents (x100) thì chia 100 ở đây
          price: item.price_cents, 
          // Nếu có giá gốc (compareAtPrice) thì map sang salePrice
          salePrice: item.compareAtPriceCents || null, 
          // Lấy ảnh đầu tiên làm ảnh đại diện
          image: item.images?.[0]?.imageUrl || 'https://via.placeholder.com/300', 
          category: item.categoryId?.name || "Sản phẩm", // Cần backend populate category, nếu chưa thì tạm hiện text
          ...item // Giữ lại các trường khác nếu cần
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Hàm mở modal
  const handleQuickView = (product) => {
    setSelectedProduct(product);
    setShowQuickView(true);
  };

  return (
    <div className="bg-light min-vh-100 pb-5">
        {/* --- BANNER HEADER (GIỮ NGUYÊN) --- */}
        <div className="position-relative py-5 mb-4 text-center text-white" 
             style={{
                 backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")',
                 backgroundSize: 'cover',
                 backgroundPosition: 'center'
             }}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            <Container className="position-relative z-1">
                <h2 className="display-5 fw-bold mb-2">Cửa Hàng Xanh</h2>
                <p className="lead mb-3 opacity-90">Sản phẩm thiên nhiên - Vì sức khỏe của bạn</p>
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

                    {/* --- HIỂN THỊ LOADING HOẶC DANH SÁCH --- */}
                    {loading ? (
                        <div className="text-center py-5">
                             <Spinner animation="border" variant="success" />
                             <p className="mt-2 text-muted">Đang tải sản phẩm...</p>
                        </div>
                    ) : (
                        <Row xs={2} md={3} lg={3} className="g-3 g-md-4">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <Col key={product.id}>
                                        <ProductCard product={product} onQuickView={handleQuickView} />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center py-5">
                                    <p>Chưa có sản phẩm nào.</p>
                                </Col>
                            )}
                        </Row>
                    )}

                    {/* Pagination - Có thể cần logic backend sau này, tạm giữ nguyên UI */}
                    {!loading && products.length > 0 && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination className="eco-pagination">
                                <Pagination.Prev />
                                <Pagination.Item active>{1}</Pagination.Item>
                                <Pagination.Item>{2}</Pagination.Item>
                                <Pagination.Item>{3}</Pagination.Item>
                                <Pagination.Next />
                            </Pagination>
                        </div>
                    )}
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