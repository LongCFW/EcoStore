import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaBox } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';  
import ProductModal from '../../components/admin/ProductModal';
import productApi from '../../services/product.service';
import categoryApi from '../../services/category.service';
import '../../assets/styles/admin.css';

const ProductManager = () => {
  const [searchParams, setSearchParams] = useSearchParams(); 
  
  // --- 1. LẤY GIÁ TRỊ TỪ URL (Thay vì useState) ---
  const searchTerm = searchParams.get('search') || '';
  const filterCategory = searchParams.get('category') || 'All';
  const currentPage = parseInt(searchParams.get('page') || '1');
  const itemsPerPage = 5;

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- 2. LOAD DATA ---
  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          setLoading(true);
          const [prodRes, catRes] = await Promise.all([
              productApi.getAll(),
              categoryApi.getAll({ params: { is_active: true } })
          ]);

          const productList = Array.isArray(prodRes.data) ? prodRes.data : (prodRes.data?.products || []);
          setProducts(productList);
          
          const categoryList = Array.isArray(catRes.data) ? catRes.data : (catRes.data?.categories || catRes.categories || []);
          setCategories(categoryList);
      } catch (error) {
          console.error("Error fetching data:", error);
          alert("Lỗi tải dữ liệu. Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.");
      } finally {
          setLoading(false);
      }
  };

  // --- 3. XỬ LÝ MODAL TỪ URL ---
  const showCreateModal = searchParams.get('action') === 'create';
  const editId = searchParams.get('edit');
  const showEditModal = !!editId;
  const editingProduct = editId ? products.find(p => p._id === editId) : null;

  const handleAddNew = () => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('action', 'create');
      setSearchParams(newParams);
  };

  const handleEdit = (product) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('edit', product._id);
      setSearchParams(newParams);
  };

  const handleCloseModal = () => {      
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      newParams.delete('edit');
      setSearchParams(newParams);
  };

  // --- 4. LOGIC CRUD ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        try {
            await productApi.delete(id);
            setProducts(products.filter(p => p._id !== id));
            alert("Xóa thành công!");
        } catch (error) {
            console.error("Delete error:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                alert("Bạn không có quyền xóa sản phẩm này (Unauthorized).");
            } else {
                alert("Xóa thất bại!");
            }
        }
    }
  };

 const handleSave = async (formData) => {
    try {
        let savedProduct;
        if (formData.id) { // UPDATE
            const res = await productApi.update(formData.id, formData);
            savedProduct = res.data?.data || res.data;
        } else { // CREATE
            const res = await productApi.create(formData);
            savedProduct = res.data?.data || res.data;
        }

        // Map category object để hiển thị ngay lập tức
        const categoryIdToFind = savedProduct.categoryId;
        const categoryObj = categories.find(c => c._id === categoryIdToFind);
        
        if (categoryObj) {
            savedProduct = { 
                ...savedProduct, 
                categoryId: categoryObj 
            };
        }

        if (formData.id) {
            setProducts(prev => prev.map(p => p._id === savedProduct._id ? savedProduct : p));
            alert("Cập nhật thành công!");
        } else {
            setProducts(prev => [savedProduct, ...prev]);
            alert("Thêm mới thành công!");
        }
        
        handleCloseModal(); 
    } catch (error) {
        console.error("Save error:", error);
        if (error.response && error.response.status === 401) {
            alert("Lỗi xác thực: Vui lòng đăng nhập lại.");
        } else {
            alert("Lưu thất bại! " + (error.response?.data?.message || ""));
        }
    }
  };

  // --- 5. FILTER & PAGINATION LOGIC ---
  const filteredProducts = products.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const catName = item.categoryId?.name || 'N/A';
      const matchCategory = filterCategory === 'All' || catName === filterCategory;
      return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  // --- 6. CÁC HÀM UPDATE URL ---
  const handlePageChange = (pageNumber) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', pageNumber);
      setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('search', e.target.value);
      newParams.set('page', 1); 
      setSearchParams(newParams);
  };

  const handleCategoryChange = (e) => {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('category', e.target.value);
      newParams.set('page', 1); 
      setSearchParams(newParams);
  };

 // Lọc brand unique
  const uniqueBrands = React.useMemo(() => {      
      const brands = products
          .map(p => p.brand)
          .filter(b => b && b.trim() !== "" && b !== "Khác");
      return [...new Set(brands)];
  }, [products]);

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Sản Phẩm</h2>
            <p className="text-muted small m-0">Tổng số: {filteredProducts.length} sản phẩm</p>
        </div>
        <Button variant="success" className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={handleAddNew}>
            <FaPlus /> Thêm mới
        </Button>
      </div>

      {/* FILTER & TABLE */}
      <div className="table-card p-3 mb-4">          
          <Row className="g-3 align-items-center">
              <Col md={4}>
                  <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>                      
                      <Form.Control 
                        type="text" 
                        placeholder="Tìm kiếm..." 
                        className="border-start-0 shadow-none"
                        value={searchTerm} 
                        onChange={handleSearchChange} 
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>                  
                  <Form.Select 
                    className="shadow-none" 
                    value={filterCategory} 
                    onChange={handleCategoryChange}
                  >
                      <option value="All">Tất cả danh mục</option>
                      {categories.map(cat => (
                          <option key={cat._id} value={cat.name}>{cat.name}</option>
                      ))}
                  </Form.Select>
              </Col>
          </Row>
      </div>

      <div className="table-card overflow-hidden">
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead>
                  <tr>
                      <th className="ps-4">Sản Phẩm</th>
                      <th>Danh Mục</th>
                      <th>Thương Hiệu</th>
                      <th>Giá Bán</th>
                      <th>Tồn Kho</th>
                      <th>Tình Trạng</th>
                      <th className="text-end pe-4">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan="7" className="text-center py-5"><Spinner animation="border" variant="success"/></td></tr>
                  ) : currentItems.length > 0 ? (
                      currentItems.map((item) => {
                        const currentStock = item.variants?.length > 0 
                            ? item.variants.reduce((sum, v) => sum + v.stock, 0) 
                            : (item.stock || 0);
                        
                        const isOutOfStock = currentStock <= 0 || item.is_active === false;

                        return (
                            <tr key={item._id}>
                                <td className="ps-4">
                                    <div className="d-flex align-items-center gap-3">
                                        <img 
                                            src={item.images?.[0]?.imageUrl || 'https://placehold.co/50'} 
                                            alt={item.name} 
                                            className="rounded-3 border object-fit-cover" 
                                            style={{width: 50, height: 50}}
                                            onError={(e) => e.target.src = 'https://placehold.co/50'} 
                                        />
                                        <div>
                                            <div className="fw-bold text-truncate" style={{maxWidth: '200px', color: 'var(--admin-text)'}}>{item.name}</div>
                                                <div className="text-muted small d-flex gap-2">                                                     
                                                    <span>SKU: {item.variants?.[0]?.sku || item.sku || 'N/A'}</span>                                                                                             
                                                    {item.variants?.[0]?.name && (
                                                        <Badge bg="secondary" className="fw-normal py-0 px-2" style={{fontSize: '0.7em'}}>
                                                            {item.variants[0].name}
                                                        </Badge>
                                                     )}
                                                </div>
                                            </div>
                                    </div>
                                </td>
                                <td>
                                    <Badge bg="light" text="dark" className="border">
                                        {item.categoryId?.name || 'N/A'}
                                    </Badge>
                                </td>
                                <td>
                                    <Badge bg="info" className="bg-opacity-10 text-info border border-info">
                                        {item.brand || 'Khác'}
                                    </Badge>
                                </td>
                                <td className="fw-bold text-success">
                                    {item.price_cents?.toLocaleString()} đ
                                </td>
                                <td>
                                    <div className="fw-bold">
                                        {currentStock}
                                    </div>
                                </td>
                                
                                <td>
                                    {isOutOfStock ? (
                                        <Badge bg="secondary" className="rounded-pill px-3">Hết hàng</Badge>
                                    ) : (
                                        <Badge bg="success" className="rounded-pill px-3">Còn hàng</Badge>
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
                          <td colSpan="7" className="text-center py-5 text-muted">
                              <FaBox size={40} className="mb-3 opacity-50"/><br/>
                              Không tìm thấy dữ liệu.
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
              <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column">
                  <Pagination className="eco-pagination mb-2">
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                      {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => handlePageChange(idx + 1)}>
                              {idx + 1}
                          </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}/>
                  </Pagination>
              </div>
          )}
      </div>

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