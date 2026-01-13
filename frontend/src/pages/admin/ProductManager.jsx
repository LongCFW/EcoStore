import React, { useState } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Dropdown } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaFilter, FaEllipsisV, FaBox } from 'react-icons/fa';
import ProductModal from '../../components/admin/ProductModal';
import '../../assets/styles/admin.css';

const ProductManager = () => {
  // Mock Data
  const initialProducts = [
    { id: 1, name: "Bàn chải tre Eco", category: "Đồ gia dụng", price: 50000, salePrice: 45000, stock: 150, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=100&q=80", status: 'active' },
    { id: 2, name: "Cà chua bi hữu cơ", category: "Rau củ", price: 35000, salePrice: null, stock: 20, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=100&q=80", status: 'active' },
    { id: 3, name: "Túi vải Canvas", category: "Thời trang", price: 120000, salePrice: 99000, stock: 0, image: "https://images.unsplash.com/photo-1597484661643-2f5fef640dd1?auto=format&fit=crop&w=100&q=80", status: 'out_stock' },
    { id: 4, name: "Xà phòng thảo mộc", category: "Mỹ phẩm", price: 80000, salePrice: null, stock: 50, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=100&q=80", status: 'active' },
    { id: 5, name: "Hạt Granola", category: "Hạt & Ngũ cốc", price: 210000, salePrice: 190000, stock: 30, image: "https://images.unsplash.com/photo-1517093750596-3536342d2242?auto=format&fit=crop&w=100&q=80", status: 'active' },
  ];

  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

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
      // Update
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      // Add new (Fake ID)
      const newProduct = { ...formData, id: Date.now(), status: 'active', image: formData.preview };
      setProducts([newProduct, ...products]);
    }
    setEditingProduct(null);
  };

  const handleAddNew = () => {
      setEditingProduct(null);
      setShowModal(true);
  }

  // Filter Logic
  const filteredProducts = products.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = filterCategory === 'All' || item.category === filterCategory;
      return matchSearch && matchCategory;
  });

  return (
    <div className="animate-fade-in">
      {/* 1. HEADER & TOOLBAR */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Sản Phẩm</h2>
            <p className="text-muted small m-0">Tổng số: {products.length} sản phẩm</p>
        </div>
        <Button variant="success" className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={handleAddNew}>
            <FaPlus /> Thêm mới
        </Button>
      </div>

      {/* 2. FILTER BAR */}
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
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>
                  <Form.Select 
                    className="shadow-none" 
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
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

      {/* 3. PRODUCT TABLE */}
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
                  {filteredProducts.length > 0 ? (
                      filteredProducts.map((item) => (
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
          
          {/* Pagination (Visual Only) */}
          <div className="p-3 border-top d-flex justify-content-between align-items-center">
              <small className="text-muted">Hiển thị {filteredProducts.length} trên tổng số {products.length}</small>
              <div className="d-flex gap-1">
                  <Button variant="outline-secondary" size="sm" disabled>Trước</Button>
                  <Button variant="success" size="sm">1</Button>
                  <Button variant="outline-secondary" size="sm">2</Button>
                  <Button variant="outline-secondary" size="sm">3</Button>
                  <Button variant="outline-secondary" size="sm">Sau</Button>
              </div>
          </div>
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