import React, { useState, useEffect } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaBox } from 'react-icons/fa';
import ProductModal from '../../components/admin/ProductModal';
import productApi from '../../services/product.service'; // Import API
import categoryApi from '../../services/category.service'; // Import Category API
import '../../assets/styles/admin.css';

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // Lưu danh sách danh mục để truyền vào Modal
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- 1. LOAD DATA TỪ API ---
  useEffect(() => {
      fetchData();
  }, []);

  const fetchData = async () => {
      try {
          setLoading(true);
          // Gọi song song 2 API: Lấy sản phẩm và Lấy danh mục
          const [prodRes, catRes] = await Promise.all([
              productApi.getAll(),
              categoryApi.getAll()
          ]);
          
          setProducts(prodRes.data || []);
          setCategories(catRes.data || []);
      } catch (error) {
          console.error("Error fetching data:", error);
          alert("Lỗi tải dữ liệu. Vui lòng thử lại!");
      } finally {
          setLoading(false);
      }
  };

  // --- 2. LOGIC CRUD ---
  const handleAddNew = () => {
      setEditingProduct(null);
      setShowModal(true);
  };

  const handleEdit = (product) => {
      setEditingProduct(product);
      setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
        try {
            await productApi.delete(id);
            // Cập nhật lại UI sau khi xóa thành công
            setProducts(products.filter(p => p._id !== id));
            alert("Xóa thành công!");
        } catch (error) {
            console.error("Delete error:", error);
            alert("Xóa thất bại!");
        }
    }
  };

  const handleSave = async (formData) => {
    try {
        if (editingProduct) {
            // --- UPDATE ---
            const res = await productApi.update(formData.id, formData);
            // Cập nhật state list (Thay thế item cũ bằng item mới từ server trả về)
            setProducts(products.map(p => p._id === formData.id ? res.data.data : p));
            alert("Cập nhật thành công!");
        } else {
            // --- CREATE ---
            const res = await productApi.create(formData);
            // Thêm item mới vào đầu danh sách
            setProducts([res.data.data, ...products]);
            alert("Thêm mới thành công!");
        }
    } catch (error) {
        console.error("Save error:", error);
        alert("Lưu thất bại! Kiểm tra lại thông tin.");
    }
  };

  // --- 3. FILTER & PAGINATION (Client-side) ---
  const filteredProducts = products.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      // Lọc theo Category ID hoặc Name tùy backend trả về gì
      // Ở đây giả sử item.categoryId là object populated
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

      {/* FILTER */}
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

      {/* TABLE */}
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
                                        src={item.images?.[0]?.imageUrl || 'https://via.placeholder.com/50'} 
                                        alt={item.name} 
                                        className="rounded-3 border object-fit-cover" 
                                        style={{width: 50, height: 50}}
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
                                {/* Tính tổng stock từ variants nếu có */}
                                <div className="fw-bold">
                                    {item.variants?.reduce((sum, v) => sum + v.stock, 0) || 0}
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
          
          {/* PAGINATION (Giữ nguyên như cũ) */}
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
        key={showModal ? (editingProduct ? editingProduct._id : 'new') : 'closed'}
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        product={editingProduct} 
        onSave={handleSave}
        categories={categories} // Truyền danh mục xuống Modal
      />
    </div>
  );
};

export default ProductManager;