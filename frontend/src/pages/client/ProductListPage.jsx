import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Button, Pagination, Offcanvas, Spinner, Form } from "react-bootstrap";
import { FaFilter } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";
import QuickViewModal from "../../components/product/QuickViewModal";
import productApi from "../../services/product.service";
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
  
  const [sortOption, setSortOption] = useState(searchParams.get("sort") || "default");
  
  // Initialize page from URL, default to 1
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"));
  const itemsPerPage = 8; // Declared once

  // --- 1. FETCH DATA ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productApi.getAll(); 
        const productList = response.data || [];

        const formattedProducts = productList.map(item => {
            let categoryData = item.categoryId;
            return {
              ...item,
              id: item._id, 
              price: item.price_cents, 
              salePrice: item.compareAtPriceCents || null, 
              image: item.images?.[0]?.imageUrl || 'https://placehold.co/300x300?text=No+Image', 
              categoryId: categoryData, 
              brand: item.brand || "Khác",
            };
        });

        setAllProducts(formattedProducts);
        const brands = [...new Set(formattedProducts.map(p => p.brand).filter(b => b && b !== "Khác"))];
        setAvailableBrands(brands);

      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []); 

  // --- 2. FILTER LOGIC & URL SYNC ---
  useEffect(() => {
      if (allProducts.length === 0) return;

      let result = [...allProducts];

      const catIds = searchParams.getAll("category");
      const brands = searchParams.getAll("brand");
      const prices = searchParams.getAll("price"); 
      const sort = searchParams.get("sort") || "default";
      const page = parseInt(searchParams.get("page") || "1");
      const searchTerm = searchParams.get("search");

      // 0. Filter Search (MỚI)
      if (searchTerm) {
          const lowerTerm = searchTerm.toLowerCase();
          result = result.filter(p => p.name.toLowerCase().includes(lowerTerm));
      }

      // 1. Filter Category
      if (catIds.length > 0) {
          result = result.filter(p => {
              // Lấy ID chuẩn dù p.categoryId là object hay string
              const pCatId = typeof p.categoryId === 'object' && p.categoryId 
                  ? p.categoryId._id 
                  : p.categoryId;
              
              // So sánh ID (chuyển về string cho chắc chắn)
              return catIds.includes(String(pCatId));
          });
      }

      // 2. Filter Brand
      if (brands.length > 0) {
          result = result.filter(p => brands.includes(p.brand));
      }

      // 3. Filter Price
      if (prices.length > 0) {
          result = result.filter(p => {
              return prices.some(range => {
                  const [min, max] = range.split('-').map(Number);
                  return p.price >= min && p.price <= max;
              });
          });
      }

      // 4. Sort
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
      const params = {};
      
      // Preserve current sort
      if (sortOption !== "default") params.sort = sortOption;
      
      // Add filters
      if (filters.categoryIds.length > 0) params.category = filters.categoryIds;
      if (filters.brands.length > 0) params.brand = filters.brands;
      if (filters.priceRanges.length > 0) params.price = filters.priceRanges;

      // FIX: Explicitly add page=1 when filtering
      // This ensures the URL looks like: ?category=...&page=1
      params.page = "1";

      setSearchParams(params);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (e) => {
      const type = e.target.value;
      setSearchParams(prev => {
          // When sorting changes, we keep existing filters but reset to page 1
          const newParams = new URLSearchParams(prev);
          newParams.set("sort", type);
          newParams.set("page", "1");
          return newParams;
      });
  };

  const handleReset = () => {
      // Reset means no filters, default sort, page 1
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

  // Pagination Calculation
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayProducts.length / itemsPerPage);

  const initialFilters = useMemo(() => ({
      categoryIds: searchParams.getAll("category"),
      brands: searchParams.getAll("brand"),
      priceRanges: searchParams.getAll("price") 
  }), [searchParams]);

  return (
    <div className="bg-light min-vh-100 pb-5">
        <div className="position-relative py-5 mb-4 text-center text-white" 
             style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1920&q=80")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark opacity-50"></div>
            <Container className="position-relative z-1">
                <h2 className="display-5 fw-bold mb-2">Cửa Hàng Xanh</h2>
                <p className="lead mb-3 opacity-90">Sản phẩm thiên nhiên - Vì sức khỏe của bạn</p>
            </Container>
        </div>

        <Container>
            <Row>
                <Col lg={3} className="d-none d-lg-block">
                    <ProductFilter 
                        onFilter={handleFilterChange} 
                        onReset={handleReset} 
                        availableBrands={availableBrands}
                        initialFilters={initialFilters}
                    />
                </Col>

                <Col lg={9}>
                    <div className="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
                        <div className="d-flex align-items-center gap-2">
                            <Button variant="outline-success" className="d-lg-none d-flex align-items-center gap-2" onClick={() => setShowFilter(true)}>
                                <FaFilter /> Lọc
                            </Button>
                            <span className="text-muted">Hiển thị <strong>{currentItems.length}</strong> / {displayProducts.length} sản phẩm</span>
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
                        <Row xs={2} md={3} lg={4} className="g-3">
                            {currentItems.length > 0 ? (
                                currentItems.map((product) => (
                                    <Col key={product.id}>
                                        <ProductCard product={product} onQuickView={handleQuickView} />
                                    </Col>
                                ))
                            ) : (
                                <Col xs={12} className="text-center py-5 text-muted d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '300px' }}>
                                    <p className="fs-5 mb-3">Không tìm thấy sản phẩm nào phù hợp.</p>
                                    <Button variant="outline-success" className="px-4 py-2 rounded-pill" onClick={handleReset}>Xem tất cả</Button>
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