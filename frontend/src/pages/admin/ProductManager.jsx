import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBox, FaFilter, FaSyncAlt, FaTags, FaLevelUpAlt, FaExclamationTriangle } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ProductModal from '../../components/admin/ProductModal';
import productApi from '../../services/product.service';
import categoryApi from '../../services/category.service';
import '../../assets/styles/admin.css';

// --- COMPONENT HIGHLIGHT TEXT ---
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.toString().split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <mark key={index} className="bg-warning text-dark px-1 rounded p-0">{part}</mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
};

const ProductManager = () => {
  // 1. URL PARAMS
  const [searchParams, setSearchParams] = useSearchParams(); 
  const searchTerm = searchParams.get('search') || '';
  const filterCategory = searchParams.get('category') || 'all';
  const filterStock = searchParams.get('stock') || 'all'; 
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = 10;

  // DEBOUNCE STATE
  const [searchInput, setSearchInput] = useState(searchTerm);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Modal URL State
  const showCreateModal = searchParams.get('action') === 'create';
  const editId = searchParams.get('edit');
  const showEditModal = !!editId;
  const editingProduct = editId ? products.find(p => p._id === editId) : null;

  // 2. FETCH DATA AN TOÀN
  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          setLoading(true);
          const [prodRes, catRes] = await Promise.all([
              productApi.getAll({ limit: 2000 }),
              categoryApi.getAll({ limit: 1000 })
          ]);
          
          let finalProducts = [];
          if (Array.isArray(prodRes)) finalProducts = prodRes; 
          else if (prodRes.data && Array.isArray(prodRes.data)) finalProducts = prodRes.data; 
          else if (prodRes.data && Array.isArray(prodRes.data.products)) finalProducts = prodRes.data.products;
          else if (Array.isArray(prodRes.products)) finalProducts = prodRes.products;

          let finalCategories = [];
          if (Array.isArray(catRes)) finalCategories = catRes;
          else if (catRes.categories && Array.isArray(catRes.categories)) finalCategories = catRes.categories;
          else if (catRes.data && Array.isArray(catRes.data.categories)) finalCategories = catRes.data.categories;
          else if (catRes.data && Array.isArray(catRes.data)) finalCategories = catRes.data;

          setProducts(finalProducts);
          setCategories(finalCategories);
      } catch {
          toast.error("Lỗi tải dữ liệu sản phẩm.");
          setProducts([]);
          setCategories([]);
      } finally {
          setLoading(false);
      }
  };

  // 3. DEBOUNCE TÌM KIẾM
  const updateParams = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchTerm) updateParams("search", searchInput);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, updateParams]);

  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  // 4. LỌC & THỐNG KÊ DATA
  const processedData = useMemo(() => {
      const productsWithStock = products.map(p => {
          const totalStock = p.variants?.length > 0 
              ? p.variants.reduce((sum, v) => sum + v.stock, 0) 
              : (p.stock || 0);
          return { ...p, totalStock };
      });

      let filtered = productsWithStock.filter(item => {
          const matchSearch = 
              item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
              (item.sku && item.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.variants && item.variants.some(v => v.sku && v.sku.toLowerCase().includes(searchTerm.toLowerCase())));
          
          const catId = typeof item.categoryId === 'object' ? item.categoryId?._id : item.categoryId;
          const matchCategory = filterCategory === 'all' ? true : catId === filterCategory;
          
          const isOut = item.totalStock <= 0 || item.is_active === false;
          const matchStock = filterStock === 'all' ? true : filterStock === 'instock' ? !isOut : isOut;

          return matchSearch && matchCategory && matchStock;
      });

      const totalCount = filtered.length;
      const inStockCount = filtered.filter(p => p.totalStock > 0 && p.is_active !== false).length;
      const outOfStockCount = totalCount - inStockCount;

      const totalPages = Math.ceil(totalCount / itemsPerPage) || 1;
      const safePage = currentPage > totalPages ? totalPages : currentPage;
      const paginatedItems = filtered.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

      return { totalCount, inStockCount, outOfStockCount, totalPages, safePage, paginatedItems };
  }, [products, searchTerm, filterCategory, filterStock, currentPage]);

  useEffect(() => {
    if (currentPage !== processedData.safePage) {
      updateParams("page", processedData.safePage.toString());
    }
  }, [processedData.safePage, currentPage, updateParams]);

  // 5. HELPER RENDER
  const getPriceDisplay = (item) => {
      if (!item.variants || item.variants.length === 0) return `${item.price_cents?.toLocaleString()} đ`;
      const prices = item.variants.map(v => v.price_cents);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return `${min.toLocaleString()} đ`;
      return `${min.toLocaleString()} đ - ${max.toLocaleString()} đ`;
  };

  const renderCategoryHierarchy = (itemCatId) => {
      if (!itemCatId || categories.length === 0) return <span className="text-muted">N/A</span>; 

      const catId = typeof itemCatId === 'object' ? itemCatId._id : itemCatId;
      const cat = categories.find(c => c._id === catId);
      if (!cat) return <span className="text-muted">N/A</span>;
      
      if (cat.parentId) {
          const parentId = typeof cat.parentId === 'object' ? cat.parentId._id : cat.parentId;
          const parentCat = categories.find(c => c._id === parentId);
          return (
              <div className="d-flex flex-column align-items-start gap-1">
                  <Badge bg="light" text="dark" className="border text-muted fw-normal">{parentCat?.name || 'Danh mục'}</Badge>
                  <div className="d-flex align-items-center gap-1 ms-2">
                      <FaLevelUpAlt style={{transform: 'rotate(90deg)'}} className="text-secondary opacity-50" />
                      <Badge bg="info" className="bg-opacity-10 text-info border border-info">{cat.name}</Badge>
                  </div>
              </div>
          );
      }
      return <Badge bg="light" text="dark" className="border fw-normal">{cat.name}</Badge>;
  };

  // 6. CRUD ACTIONS
  const handleAddNew = () => updateParams('action', 'create');
  const handleEdit = (product) => updateParams('edit', product._id);
  const handleCloseModal = () => {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      newParams.delete('edit');
      setSearchParams(newParams);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        try {
            await productApi.delete(id);
            setProducts(products.filter(p => p._id !== id));
            toast.success("Xóa sản phẩm thành công!");
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể xóa sản phẩm này.");
        }
    }
  };

  const handleSave = async (formData) => {
    try {
        let savedProduct;
        if (formData.id) {
            const res = await productApi.update(formData.id, formData);
            savedProduct = res.data?.data || res.data;
            setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p));
            toast.success("Cập nhật thành công!");
        } else {
            const res = await productApi.create(formData);
            savedProduct = res.data?.data || res.data;
            setProducts(prev => [savedProduct, ...prev]);
            toast.success("Thêm mới thành công!");
        }
        handleCloseModal(); 
    } catch (error) {
        toast.error("Lưu thất bại! " + (error.response?.data?.message || ""));
    }
  };

  const uniqueBrands = useMemo(() => {      
      const brands = products.map(p => p.brand).filter(b => b && b.trim() !== "" && b !== "Khác");
      return [...new Set(brands)];
  }, [products]);

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Sản Phẩm</h2>
            <p className="text-muted small m-0 mt-1">Kho hàng và biến thể sản phẩm</p>
        </div>
        <div className="d-flex gap-2">
            <Button variant="success" className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={handleAddNew}>
                <FaPlus /> Thêm Sản Phẩm
            </Button>
        </div>
      </div>

      {/* THỐNG KÊ */}
      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaBox size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{processedData.totalCount}</h3>
                <span className="text-muted small">Tổng sản phẩm</span>
             </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaTags size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{processedData.inStockCount}</h3>
                <span className="text-muted small">Đang bán (Còn hàng)</span>
             </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaExclamationTriangle size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{processedData.outOfStockCount}</h3>
                <span className="text-muted small">Hết hàng / Đã ẩn</span>
             </div>
          </div>
        </Col>
      </Row>

      {/* FILTER BAR */}
      <div className="table-card p-3 mb-4 bg-white border rounded shadow-sm">          
          <Row className="g-3 align-items-center">
              <Col xs={12} md={4}>
                  <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>                      
                      <Form.Control 
                        type="text" 
                        placeholder="Tên sản phẩm, SKU..." 
                        className="border-start-0 shadow-none bg-light"
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)} 
                      />
                  </InputGroup>
              </Col>
              <Col xs={12} md={3}>                  
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0"><FaFilter className="text-muted" size={12}/></InputGroup.Text>
                    <Form.Select className="border-start-0 shadow-none bg-light" value={filterCategory} onChange={(e) => updateParams("category", e.target.value)}>
                        <option value="all">-- Tất cả Danh mục --</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name} {cat.parentId ? '(Con)' : '(Gốc)'}</option>
                        ))}
                    </Form.Select>
                  </InputGroup>
              </Col>
              <Col xs={12} md={3}>                  
                  <Form.Select className="shadow-none bg-light" value={filterStock} onChange={(e) => updateParams("stock", e.target.value)}>
                      <option value="all">-- Tình trạng Kho --</option>
                      <option value="instock">Còn hàng</option>
                      <option value="outofstock">Hết hàng / Ẩn</option>
                  </Form.Select>
              </Col>
              <Col xs={12} md={2}>
                  <Button variant="light" onClick={handleResetFilters} className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 border shadow-sm text-secondary hover-scale">
                      <FaSyncAlt /> Làm mới
                  </Button>
              </Col>
          </Row>
      </div>

      {/* TABLE DATA */}
      <div className="table-card border rounded shadow-sm bg-white" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <tr>
                      <th className="ps-4 py-3" style={{width: '60px'}}>STT</th>
                      <th className="py-3" style={{width: '90px'}}>Hình ảnh</th>
                      <th className="py-3">Tên sản phẩm</th>
                      <th className="py-3">Danh mục</th>
                      <th className="py-3 text-end">Giá bán</th>
                      <th className="py-3 text-center">Kho</th>
                      <th className="text-end pe-4 py-3">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan={7} className="text-center py-5 border-bottom-0"><Spinner animation="border" variant="success"/></td></tr>
                  ) : processedData.paginatedItems.length > 0 ? (
                      processedData.paginatedItems.map((item, index) => {
                        const isOut = item.totalStock <= 0 || item.is_active === false;
                        const realIndex = (processedData.safePage - 1) * itemsPerPage + index + 1;
                        
                        return (
                            <tr key={item._id}>
                                <td className="ps-4 fw-bold text-muted">{realIndex}</td>
                                <td>
                                    <div className="rounded-3 border overflow-hidden bg-light" style={{width: '56px', height: '56px'}}>
                                        <img 
                                            src={item.images?.[0]?.imageUrl || 'https://placehold.co/100x100?text=No+Image'} 
                                            alt={item.name} 
                                            className="w-100 h-100 object-fit-cover" 
                                            onError={(e) => e.target.src = 'https://placehold.co/100x100?text=Error'} 
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div className="fw-bold text-dark mb-1" style={{fontSize: '1rem'}}>
                                        <HighlightText text={item.name} highlight={searchTerm} />
                                    </div>
                                    <div className="text-muted small mb-1">
                                        ||||| <HighlightText text={item.variants?.[0]?.sku || item.sku || 'Chưa có SKU'} highlight={searchTerm} />
                                    </div>
                                    {item.variants && item.variants.length > 0 && (
                                        <Badge bg="secondary" className="bg-opacity-10 text-secondary border fw-normal">
                                            <FaTags className="me-1"/> {item.variants.length} phân loại
                                        </Badge>
                                    )}
                                </td>
                                <td>
                                    {renderCategoryHierarchy(item.categoryId)}
                                </td>
                                <td className="fw-bold text-success text-end" style={{fontSize: '1.05rem'}}>
                                    {getPriceDisplay(item)}
                                </td>
                                <td className="text-center">
                                    {isOut ? (
                                        <Badge bg="danger" className="rounded-2 px-2 py-1">Hết hàng</Badge>
                                    ) : (
                                        <Badge bg="warning" text="dark" className="rounded-2 px-2 py-1 fw-bold">{item.totalStock}</Badge>
                                    )}
                                </td>                               

                                <td className="text-end pe-4">
                                    <div className="d-flex justify-content-end gap-2">
                                        <Button variant="light" size="sm" className="rounded-circle border shadow-sm text-primary hover-scale" onClick={() => handleEdit(item)}>
                                            <FaEdit />
                                        </Button>
                                        <Button variant="light" size="sm" className="rounded-circle border shadow-sm text-danger hover-scale" onClick={() => handleDelete(item._id)}>
                                            <FaTrash />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                      })
                  ) : (
                      <tr>
                          <td colSpan={7} className="border-bottom-0 p-0">
                              {/* Div bọc được fixed width và height để chống xẹp */}
                              <div className="d-flex flex-column align-items-center justify-content-center w-100" style={{ minHeight: '200px' }}>
                                  <FaBox size={40} className="mb-3 text-muted opacity-50"/>
                                  <h6 className="text-muted mb-0" style={{ whiteSpace: 'nowrap' }}>Không tìm thấy sản phẩm nào.</h6>
                              </div>
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
      </div>
      
      {/* PAGINATION */}
      {processedData.totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-center align-items-center bg-white rounded-bottom shadow-sm mt-2">
              <Pagination className="eco-pagination mb-0">
                  <Pagination.Prev onClick={() => updateParams("page", processedData.safePage - 1)} disabled={processedData.safePage === 1}/>
                  {[...Array(processedData.totalPages)].map((_, idx) => (
                      <Pagination.Item key={idx + 1} active={idx + 1 === processedData.safePage} onClick={() => updateParams("page", idx + 1)}>
                          {idx + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => updateParams("page", processedData.safePage + 1)} disabled={processedData.safePage === processedData.totalPages}/>
              </Pagination>
          </div>
      )}

      {/* MODAL */}
      <ProductModal 
        key={editingProduct ? editingProduct._id : 'create-new'}
        show={showCreateModal || showEditModal} 
        handleClose={handleCloseModal} 
        product={editingProduct} 
        onSave={handleSave}
        categories={categories}
        availableBrands={uniqueBrands}
      />
    </div>
  );
};

export default ProductManager;