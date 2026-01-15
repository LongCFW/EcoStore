import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaBox } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';  
import ProductModal from '../../components/admin/ProductModal';
import productApi from '../../services/product.service';
import categoryApi from '../../services/category.service';
import '../../assets/styles/admin.css';

const ProductManager = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // Hook quản lý URL
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State tìm kiếm & phân trang
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 1. LOAD DATA ---
  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          setLoading(true);
          const [prodRes, catRes] = await Promise.all([
              productApi.getAll(),
              categoryApi.getAll()
          ]);
          setProducts(prodRes.data || []);
          setCategories(catRes.data || []);
      } catch (error) {
          console.error("Error fetching data:", error);
          alert("Lỗi tải dữ liệu. Vui lòng kiểm tra lại kết nối hoặc đăng nhập lại.");
      } finally {
          setLoading(false);
      }
  };

  // --- 2. XỬ LÝ URL MODAL (Create/Edit) ---
  
  // Kiểm tra URL để xác định có mở Modal không và mở chế độ nào
  const showCreateModal = searchParams.get('action') === 'create';
  const editId = searchParams.get('edit');
  const showEditModal = !!editId; // Có ID là đang sửa
  
  // Tìm sản phẩm đang sửa dựa trên ID từ URL
  const editingProduct = editId ? products.find(p => p._id === editId) : null;

  // Hàm mở Modal Thêm Mới -> Cập nhật URL
  const handleAddNew = () => {
      setSearchParams({ action: 'create' });
  };

  // Hàm mở Modal Sửa -> Cập nhật URL
  const handleEdit = (product) => {
      setSearchParams({ edit: product._id });
  };

  // Hàm Đóng Modal -> Xóa params URL
  const handleCloseModal = () => {
      setSearchParams({});
  };

  // --- 3. LOGIC CRUD (Giữ nguyên, chỉ sửa đoạn đóng modal) ---
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        try {
            await productApi.delete(id);
            setProducts(products.filter(p => p._id !== id));
            alert("Xóa thành công!");
        } catch (error) {
            console.error("Delete error:", error);
            // Check lỗi 401/403 để báo user
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
        if (editingProduct) { // Dùng biến editingProduct tính từ URL
            const res = await productApi.update(formData.id, formData);
            setProducts(products.map(p => p._id === formData.id ? res.data.data : p));
            alert("Cập nhật thành công!");
        } else {
            const res = await productApi.create(formData);
            setProducts([res.data.data, ...products]);
            alert("Thêm mới thành công!");
        }
        handleCloseModal(); // Đóng modal = xóa URL
    } catch (error) {
        console.error("Save error:", error);
        if (error.response && error.response.status === 401) {
            alert("Lỗi xác thực: Vui lòng đăng nhập lại (Token hết hạn hoặc không hợp lệ).");
        } else {
            alert("Lưu thất bại! " + (error.response?.data?.message || ""));
        }
    }
  };

  // --- 4. FILTER & PAGINATION ---
  const filteredProducts = products.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const catName = typeof item.categoryId === 'object' ? item.categoryId.name : "";
      const matchCategory = filterCategory === 'All' || catName === filterCategory;
      return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
                        onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>
                  <Form.Select 
                    className="shadow-none" 
                    value={filterCategory}
                    onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1);}}
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
                      <th>Giá Bán</th>
                      <th>Tồn Kho</th>
                      <th className="text-end pe-4">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan="5" className="text-center py-5"><Spinner animation="border" variant="success"/></td></tr>
                  ) : currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item._id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img 
                                        src={item.images?.[0]?.imageUrl || 'https://placehold.co/50'} 
                                        alt={item.name} 
                                        className="rounded-3 border object-fit-cover" 
                                        style={{width: 50, height: 50}}
                                        onError={(e) => e.target.src = 'https://placehold.co/50'} // Fallback nếu ảnh lỗi
                                    />
                                    <div>
                                        <div className="fw-bold text-truncate" style={{maxWidth: '200px', color: 'var(--admin-text)'}}>{item.name}</div>
                                        <small className="text-muted">SKU: {item.sku || 'N/A'}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Badge bg="light" text="dark" className="border">
                                    {typeof item.categoryId === 'object' ? item.categoryId.name : 'N/A'}
                                </Badge>
                            </td>
                            <td className="fw-bold text-success">
                                {item.price_cents?.toLocaleString()} đ
                            </td>
                            <td>
                                <div className="fw-bold">
                                    {/* Logic hiển thị stock */}
                                    {item.variants?.length > 0 
                                        ? item.variants.reduce((sum, v) => sum + v.stock, 0) 
                                        : (item.stock || 0)}
                                </div>
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
                      ))
                  ) : (
                      <tr>
                          <td colSpan="5" className="text-center py-5 text-muted">
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
        key={showCreateModal ? 'new' : (editId || 'closed')} // Key thay đổi để reset form
        show={showCreateModal || showEditModal} 
        handleClose={handleCloseModal} 
        product={editingProduct} 
        onSave={handleSave}
        categories={categories}
      />
    </div>
  );
};

export default ProductManager;