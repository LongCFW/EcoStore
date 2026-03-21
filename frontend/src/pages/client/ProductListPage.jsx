import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Button, Pagination, Offcanvas, Spinner, Form, Badge } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import QuickViewModal from "../../components/product/QuickViewModal";
import productApi from "../../services/product.service";
import categoryApi from "../../services/category.service"; 
import '../../assets/styles/products.css';

const ProductListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilter, setShowFilter] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [allProducts, setAllProducts] = useState([]); 
  const [displayProducts, setDisplayProducts] = useState([]); 
  const [availableBrands, setAvailableBrands] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(""); 
  
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "default");
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1", 10));
  const itemsPerPage = 8; 

  // TÁCH BIẾN ĐỂ FIX CẢNH BÁO ESLINT
  const categoryParam = searchParams.get("category");

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
             productApi.getAll({ limit: 2000, is_active: true }), 
             categoryApi.getAll({ limit: 1000 })
        ]);

        let productList = [];
        if (Array.isArray(prodRes)) productList = prodRes;
        else if (prodRes.data && Array.isArray(prodRes.data)) productList = prodRes.data;
        else if (prodRes.data && Array.isArray(prodRes.data.products)) productList = prodRes.data.products;
        else if (Array.isArray(prodRes.products)) productList = prodRes.products;

        const formattedProducts = productList.map(item => ({
              ...item,
              id: item._id, 
              price: item.price_cents, 
              salePrice: item.compareAtPriceCents || null, 
              image: item.images?.[0]?.imageUrl || 'https://placehold.co/300x300?text=No+Image', 
              categoryId: item.categoryId, 
              brand: item.brand || "Khác",
        }));

        setAllProducts(formattedProducts);
        
        const brands = [...new Set(formattedProducts.map(p => p.brand).filter(b => b && b !== "Khác"))];
        setAvailableBrands(brands);

        // Lấy tên Category để hiển thị tiêu đề, dùng biến categoryParam đã tách
        if (categoryParam) {
             let catList = [];
             if (Array.isArray(catRes)) catList = catRes;
             else if (catRes.categories && Array.isArray(catRes.categories)) catList = catRes.categories;
             else if (catRes.data && Array.isArray(catRes.data.categories)) catList = catRes.data.categories;
             else if (catRes.data && Array.isArray(catRes.data)) catList = catRes.data;
             
             const foundCat = catList.find(c => c._id === categoryParam);
             if (foundCat) setCategoryName(foundCat.name);
        } else {
             setCategoryName("");
        }

      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductsAndCategories();
  }, [categoryParam]); // <--- Đã sửa thành biến, dọn sạch cảnh báo ESLint

  // --- 2. FILTER LOGIC & URL SYNC ---
  useEffect(() => {
      if (allProducts.length === 0) return;

      let result = [...allProducts];

      const catId = searchParams.get("category"); 
      const brands = searchParams.getAll("brand");
      const prices = searchParams.getAll("price"); 
      const sort = searchParams.get("sort") || "default";
      const page = parseInt(searchParams.get("page") || "1", 10);
      const searchTerm = searchParams.get("search");

      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          result = result.filter(p => p.name.toLowerCase().includes(lowerTerm));
      }

      if (catId) {
          result = result.filter(p => {
              const pCatId = typeof p.categoryId === 'object' && p.categoryId ? p.categoryId._id : p.categoryId;
              return String(pCatId) === catId;
          });
      }

      if (brands.length > 0) {
          result = result.filter(p => brands.includes(p.brand));
      }

      if (prices.length > 0) {
          result = result.filter(p => {
              return prices.some(range => {
                  const [min, max] = range.split('-').map(Number);
                  return p.price >= min && p.price <= max;
              });
          });
      }

      if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
      else if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
      else if (sort === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));
      else if (sort === "name-desc") result.sort((a, b) => b.name.localeCompare(a.name));

      setDisplayProducts(result);
      setSortOption(sort);
      setCurrentPage(page);
      
  }, [searchParams, allProducts]);

  // --- 3. EVENT HANDLERS ---
  const handleFilterChange = (filters) => {
      const currentParams = new URLSearchParams(searchParams);
      
      currentParams.delete("brand");
      currentParams.delete("price");

      if (filters.brands && filters.brands.length > 0) {
          filters.brands.forEach(b => currentParams.append("brand", b));
      }
      if (filters.priceRanges && filters.priceRanges.length > 0) {
          filters.priceRanges.forEach(p => currentParams.append("price", p));
      }

      currentParams.set("page", "1");
      setSearchParams(currentParams);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
      const type = e.target.value;
      setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set("sort", type);
          newParams.set("page", "1");
          return newParams;
      });
  };

  const handleReset = () => {
      // Xóa SẠCH mọi tham số trên URL (Category, Search, Brand, Price) và đưa về trang 1
      setSearchParams({ page: "1" }); 
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginate = (pageNumber) => {
      setSearchParams(prev => {
          const newParams = new URLSearchParams(prev);
          newParams.set("page", pageNumber);
          return newParams;
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickView = (product) => { setSelectedProduct(product); setShowQuickView(true); };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const initialFilters = useMemo(() => ({
      categoryIds: [], 
      brands: searchParams.getAll("brand"),
      priceRanges: searchParams.getAll("price") 
  }), [searchParams]);

  return (
    <div className="bg-light min-vh-100 pb-5">
        <div className="position-relative py-5 mb-4 text-center text-white" 
             style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', height: '220px'}}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            <Container className="position-relative z-1 d-flex flex-column h-100 justify-content-center">
                <h1 className="display-4 fw-bold mb-2">Cửa Hàng Xanh</h1>
                <p className="lead mb-0 opacity-90">Sản phẩm thiên nhiên - Vì sức khỏe của bạn</p>
            </Container>
        </div>

        <Container>
            <Row>
                {/* SIDEBAR BỘ LỌC */}
                <Col lg={3} className="d-none d-lg-block">
                    <ProductFilter 
                        onFilter={handleFilterChange} 
                        onReset={handleReset} 
                        availableBrands={availableBrands}
                        initialFilters={initialFilters}
                    />
                </Col>

                {/* CỘT CHÍNH HIỂN THỊ SẢN PHẨM */}
                <Col lg={9}>
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border border-success border-start-0 border-end-0 border-top-0" style={{ borderBottomWidth: '4px !important' }}>
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="outline-success" className="d-lg-none d-flex align-items-center gap-2" onClick={() => setShowFilter(true)}>
                                <FaFilter /> Lọc
                            </Button>
                            
                            <span className="text-dark">
                                Tìm thấy <strong>{displayProducts.length}</strong> sản phẩm 
                                {categoryName && <span className="ms-2">thuộc <Badge bg="success" className="fw-normal">{categoryName}</Badge></span>}
                                {searchParams.get("search") && <span className="ms-2 d-none d-sm-inline-block">cho từ khóa <Badge bg="secondary" className="fw-normal">"{searchParams.get("search")}"</Badge></span>}
                            </span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-muted d-none d-md-block small">Sắp xếp:</span>
                            <Form.Select size="sm" style={{ width: "160px", borderRadius: '20px' }} value={sortOption} onChange={handleSortChange}>
                                <option value="default">Mặc định</option>
                                <option value="price-asc">Giá: Thấp đến Cao</option>
                                <option value="price-desc">Giá: Cao đến Thấp</option>
                                <option value="name-asc">Tên: A đến Z</option>
                                <option value="name-desc">Tên: Z đến A</option>
                            </Form.Select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-5"><Spinner animation="border" variant="success" /></div>
                    ) : (
                        <Row xs={2} md={3} lg={3} xl={4} className="g-3">
                            {currentItems.length > 0 ? (
                                currentItems.map((product) => (
                                    <Col key={product.id}>
                                        <ProductCard product={product} onQuickView={handleQuickView} />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                                    <p className="fs-5 mb-3">Không tìm thấy sản phẩm nào phù hợp.</p>
                                    <Button variant="outline-success" className="px-4 py-2 rounded-pill" onClick={handleReset}>Bỏ bộ lọc</Button>
                                </Col>
                            )}
                        </Row>
                    )}

                    {!loading && totalPages > 1 && (
                        <div className="d-flex justify-content-center mt-5">
                            <Pagination className="eco-pagination">
                                <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}/>
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item key={index + 1} active={index + 1 === currentPage} onClick={() => paginate(index + 1)}>
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                                <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}/>
                            </Pagination>
                        </div>
                    )}
                </Col>
            </Row>
        </Container>

        {/* MOBILE MENU LỌC */}
        <Offcanvas show={showFilter} onHide={() => setShowFilter(false)} placement="start">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title className="fw-bold text-success">Bộ lọc</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <ProductFilter 
                    onFilter={handleFilterChange} 
                    onReset={handleReset} 
                    availableBrands={availableBrands}
                    initialFilters={initialFilters}
                />
            </Offcanvas.Body>
        </Offcanvas>

        <QuickViewModal show={showQuickView} handleClose={() => setShowQuickView(false)} product={selectedProduct} />
    </div>
  );
};

export default ProductListPage;