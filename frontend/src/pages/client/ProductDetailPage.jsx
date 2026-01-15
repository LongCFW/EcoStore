import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Tabs, Tab, Breadcrumb, Spinner } from "react-bootstrap";
import { FaShoppingCart, FaHeart, FaMinus, FaPlus, FaStar, FaTruck, FaShieldAlt, FaUndo } from "react-icons/fa";
import ProductCard from "../../components/product/ProductCard";
import QuickViewModal from "../../components/product/QuickViewModal";
import productApi from "../../services/product.service";
import '../../assets/styles/products.css';

const ProductDetailPage = () => {
  const { slug } = useParams(); 
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]); // State chứa sản phẩm tương tự
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States tương tác
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null); 

  // States Quick View (Đã khôi phục)
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState(null);

  // --- 1. LẤY DỮ LIỆU SẢN PHẨM CHÍNH ---
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // 1. Lấy chi tiết sản phẩm
        const response = await productApi.getBySlug(slug);
        const productData = response.data; 
        setProduct(productData);
        
        // Chọn biến thể đầu tiên
        if (productData.variants && productData.variants.length > 0) {
            setSelectedVariant(productData.variants[0]);
        }
        setQuantity(1);

        // 2. Sau khi có sản phẩm -> Lấy danh mục ID -> Gọi API lấy sản phẩm tương tự
        // (Kiểm tra kỹ categoryId là object hay string để lấy ID chuẩn)
        const catId = typeof productData.categoryId === 'object' ? productData.categoryId._id : productData.categoryId;
        
        if (catId) {
            const relatedRes = await productApi.getRelated(catId, productData._id);
            // Mapping dữ liệu related products cho chuẩn format của ProductCard (giống ProductListPage)
            const mappedRelated = (relatedRes.data || []).map(item => ({
                ...item,
                id: item._id, // ProductCard dùng id
                price: item.price_cents,
                salePrice: item.compareAtPriceCents || null,
                image: item.images?.[0]?.imageUrl || 'https://placehold.co/300x300?text=No+Image',
                categoryId: typeof item.categoryId === 'object' ? item.categoryId._id : item.categoryId,
                brand: item.brand || "Khác"
            }));
            setRelatedProducts(mappedRelated);
        }

      } catch (err) {
        console.error("Lỗi:", err);
        setError("Không tìm thấy sản phẩm hoặc có lỗi xảy ra.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  // --- LOGIC HANDLERS ---
  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  const handleVariantChange = (variant) => {
      setSelectedVariant(variant);
      setQuantity(1); 
  };

  // Hàm mở Modal Quick View (Đã khôi phục và dùng được)
  const handleQuickView = (prod) => {
    setSelectedQuickViewProduct(prod);
    setShowQuickView(true);
  };

  // --- RENDER ---
  if (loading) return (
      <div className="text-center py-5" style={{minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Spinner animation="border" variant="success" />
      </div>
  );

  if (error || !product) return (
      <Container className="py-5 text-center">
          <h3>{error || "Sản phẩm không tồn tại"}</h3>
          <Button as={Link} to="/products" variant="success" className="mt-3 rounded-pill">Quay lại cửa hàng</Button>
      </Container>
  );

  // Tính toán hiển thị
  const currentPrice = selectedVariant ? selectedVariant.price_cents : product.price_cents;
  const currentStock = selectedVariant ? selectedVariant.stock : (product.variants?.length > 0 ? 0 : 100); 
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const categoryName = product.categoryId?.name || "Sản phẩm";
  const mainImage = (product.images && product.images.length > 0 && product.images[0].imageUrl) 
      ? product.images[0].imageUrl 
      : 'https://placehold.co/600x600?text=No+Image';

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
          {/* IMAGE */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="border rounded-4 overflow-hidden mb-3 position-relative shadow-sm d-flex align-items-center justify-content-center bg-white" style={{height: '450px'}}>
                <img src={mainImage} alt={product.name} className="mw-100 mh-100 object-fit-contain" />
            </div>
          </Col>

          {/* INFO */}
          <Col lg={6}>
            <div className="ps-lg-4">
                <Badge bg="success" className="mb-2 bg-opacity-75">{categoryName}</Badge>
                <h2 className="fw-bold mb-3 text-dark">{product.name}</h2>
                
                <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="text-warning small">
                        {[...Array(5)].map((_,i) => <FaStar key={i} />)} 
                        <span className="text-dark fw-bold ms-2">5.0</span>
                    </div>
                    <div className="border-start ps-3 text-muted small">Đã bán: 100+</div>
                    <div className="border-start ps-3 text-muted small">SKU: {currentSku}</div>
                </div>

                <div className="price-tag-detail mb-4">
                    <span className="fs-2 fw-bold me-3 text-success">
                        {currentPrice?.toLocaleString()} đ
                    </span>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                    <div className="mb-4">
                        <label className="fw-bold mb-2 d-block">Phân loại:</label>
                        <div className="d-flex flex-wrap gap-2">
                            {product.variants.map((variant) => (
                                <Button 
                                    key={variant._id}
                                    variant={selectedVariant?._id === variant._id ? "success" : "outline-secondary"}
                                    className="rounded-pill px-4"
                                    onClick={() => handleVariantChange(variant)}
                                >
                                    {variant.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-4">
                    <p className="text-muted opacity-75" style={{lineHeight: '1.8'}}>
                        {product.shortDescription || product.description?.substring(0, 150) + "..."}
                    </p>
                </div>

                {/* Actions */}
                <div className="d-flex flex-wrap gap-3 mb-4 align-items-center">
                    <div className="input-group border rounded-pill overflow-hidden" style={{width: '140px'}}>
                        <button className="btn btn-light border-0" onClick={() => handleQuantity('dec')}><FaMinus size={12}/></button>
                        <input type="text" className="form-control border-0 text-center bg-white fw-bold" value={quantity} readOnly />
                        <button className="btn btn-light border-0" onClick={() => handleQuantity('inc')}><FaPlus size={12}/></button>
                    </div>
                    <Button 
                        variant="success" size="lg" className="rounded-pill px-5 fw-bold shadow-sm flex-grow-1"
                        disabled={currentStock <= 0}
                    >
                        <FaShoppingCart className="me-2"/> {currentStock > 0 ? "Thêm vào giỏ" : "Hết hàng"}
                    </Button>
                    <Button variant="outline-danger" className="rounded-circle p-0 d-flex align-items-center justify-content-center border-2" style={{width: '48px', height: '48px'}}>
                        <FaHeart />
                    </Button>
                </div>
                
                {/* Policy */}
                <div className="d-flex gap-4 pt-4 border-top">
                    <div className="d-flex align-items-center gap-2"><FaTruck className="text-success fs-4"/><span className="small fw-medium">FreeShip <br/> từ 300k</span></div>
                    <div className="d-flex align-items-center gap-2"><FaShieldAlt className="text-success fs-4"/><span className="small fw-medium">Hàng chính hãng <br/> 100%</span></div>
                    <div className="d-flex align-items-center gap-2"><FaUndo className="text-success fs-4"/><span className="small fw-medium">Đổi trả <br/> trong 7 ngày</span></div>
                </div>
            </div>
          </Col>
        </Row>

        {/* TABS */}
        <Row className="mb-5">
            <Col>
                <Tabs defaultActiveKey="desc" className="mb-4 custom-tabs border-bottom-0 justify-content-center">
                    <Tab eventKey="desc" title="Mô tả chi tiết">
                        <div className="bg-light p-4 rounded-4 shadow-sm" style={{minHeight: '200px'}}>
                            <h5 className="fw-bold mb-3">Thông tin sản phẩm</h5>
                            <div style={{whiteSpace: 'pre-line'}}>{product.description}</div>
                        </div>
                    </Tab>
                    <Tab eventKey="brand" title="Thương hiệu">
                        <div className="bg-light p-4 rounded-4 shadow-sm">
                            <p>Sản phẩm thuộc thương hiệu: <strong>{product.brand || "Đang cập nhật"}</strong></p>
                        </div>
                    </Tab>
                </Tabs>
            </Col>
        </Row>

        {/* SẢN PHẨM TƯƠNG TỰ (ĐÃ HOÀN THIỆN) */}
        {relatedProducts.length > 0 && (
            <div className="py-4">
                <h3 className="fw-bold mb-4 text-center">Sản phẩm tương tự</h3>
                <Row xs={2} md={4} className="g-4">
                    {relatedProducts.map(relProd => (
                        <Col key={relProd.id}>
                            <ProductCard 
                                product={relProd} 
                                onQuickView={handleQuickView} // Nút Quick View hoạt động
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        )}
      </Container>

      {/* MODAL QUICK VIEW */}
      <QuickViewModal 
        key={selectedQuickViewProduct ? selectedQuickViewProduct.id : 'quick-view-modal'}
        show={showQuickView} 
        handleClose={() => setShowQuickView(false)} 
        product={selectedQuickViewProduct} 
      />
    </div>
  );
};

export default ProductDetailPage;