import React, { useState } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaBox } from 'react-icons/fa';
import ProductModal from '../../components/admin/ProductModal';
import '../../assets/styles/admin.css';

const ProductManager = () => {
  // 1. GENERATE MOCK DATA (25 SẢN PHẨM)
  const [products, setProducts] = useState(() => {
      const data = [];
      const categories = ["Rau củ", "Trái cây", "Đồ gia dụng", "Thời trang", "Mỹ phẩm"];
      const names = ["Bàn chải tre", "Cà chua bi", "Túi vải Canvas", "Xà phòng", "Hạt Granola"];
      
      for (let i = 1; i <= 25; i++) {
          data.push({
              id: i,
              name: `${names[i % 5]} Eco ${i}`,
              category: categories[i % 5],
              price: 50000 + (i * 1000),
              salePrice: i % 3 === 0 ? 45000 + (i * 1000) : null,
              stock: i % 4 === 0 ? 0 : 20 + i,
              image: `https://via.placeholder.com/150?text=Product+${i}`, // Hoặc link ảnh thật
              status: i % 4 === 0 ? 'out_stock' : 'active'
          });
      }
      return data;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC XỬ LÝ ---
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSave = (formData) => {
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      const newProduct = { ...formData, id: Date.now(), status: 'active', image: formData.preview };
      setProducts([newProduct, ...products]);
    }
    setEditingProduct(null);
  };

  const handleAddNew = () => {
      setEditingProduct(null);
      setShowModal(true);
  }

  // --- FILTER & PAGINATION ---
  const filteredProducts = products.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchSearch && matchCategory;
  });

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
      setFilterCategory(e.target.value);
      setCurrentPage(1);
  };

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
                        placeholder="Tìm kiếm tên sản phẩm..." 
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
                    onChange={handleFilterChange}
                  >
                      <option value="All">Tất cả danh mục</option>
                      <option value="Rau củ">Rau củ</option>
                      <option value="Trái cây">Trái cây</option>
                      <option value="Đồ gia dụng">Đồ gia dụng</option>
                      <option value="Thời trang">Thời trang</option>
                  </Form.Select>
              </Col>
              <Col md={2}>
                  <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                      <FaFilter /> Lọc thêm
                  </Button>
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
                      <th>Trạng Thái</th>
                      <th className="text-end pe-4">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {currentItems.length > 0 ? (
                      currentItems.map((item) => (
                        <tr key={item.id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img 
                                        src={item.image} 
                                        alt={item.name} 
                                        className="rounded-3 border object-fit-cover" 
                                        style={{width: 50, height: 50}}
                                    />
                                    <div>
                                        <div className="fw-bold text-truncate" style={{maxWidth: '200px', color: 'var(--admin-text)'}}>{item.name}</div>
                                        <small className="text-muted">ID: #SP{item.id}</small>
                                    </div>
                                </div>
                            </td>
                            <td><Badge bg="light" text="dark" className="border">{item.category}</Badge></td>
                            <td>
                                <div className="fw-bold text-success">{item.salePrice ? item.salePrice.toLocaleString() : item.price.toLocaleString()} đ</div>
                                {item.salePrice && <small className="text-muted text-decoration-line-through">{item.price.toLocaleString()} đ</small>}
                            </td>
                            <td>
                                <div className="fw-bold">{item.stock}</div>
                            </td>
                            <td>
                                {item.stock > 0 ? (
                                    <span className="badge bg-success bg-opacity-10 text-success rounded-pill px-3">Còn hàng</span>
                                ) : (
                                    <span className="badge bg-danger bg-opacity-10 text-danger rounded-pill px-3">Hết hàng</span>
                                )}
                            </td>
                            <td className="text-end pe-4">
                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="light" size="sm" className="rounded-circle border shadow-sm text-primary hover-scale" onClick={() => handleEdit(item)}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="light" size="sm" className="rounded-circle border shadow-sm text-danger hover-scale" onClick={() => handleDelete(item.id)}>
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                              <FaBox size={40} className="mb-3 opacity-50"/><br/>
                              Không tìm thấy sản phẩm nào.
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
          
          {/* PAGINATION */}
          {totalPages > 1 && (
              <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column">
                  <Pagination className="eco-pagination mb-2">
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item 
                            key={idx + 1} 
                            active={idx + 1 === currentPage}
                            onClick={() => handlePageChange(idx + 1)}
                          >
                              {idx + 1}
                          </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                      />
                  </Pagination>
                  
                  <small className="text-muted">
                      Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredProducts.length)} trên tổng số {filteredProducts.length} sản phẩm
                  </small>
              </div>
          )}
      </div>

      {/* MODAL */}
      <ProductModal 
        key={showModal ? (editingProduct ? editingProduct.id : 'new') : 'closed'}
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        product={editingProduct} 
        onSave={handleSave} 
      />
    </div>
  );
};

export default ProductManager;