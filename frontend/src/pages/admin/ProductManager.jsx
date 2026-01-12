import React, { useState } from 'react';
import { Card, Table, Button, Badge, Form, InputGroup } from 'react-bootstrap';
import { FaPlus, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import ProductModal from '../../components/admin/ProductModal';

const ProductManager = () => {
  // Dữ liệu giả định
  const [products, setProducts] = useState([
    { id: 1, name: "Bàn chải tre Eco", category: "Cá nhân", price: 45000, stock: 100, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Bình giữ nhiệt", category: "Gia dụng", price: 199000, stock: 50, image: "https://via.placeholder.com/50" },
    { id: 3, name: "Túi vải Canvas", category: "Thời trang", price: 120000, stock: 200, image: "https://via.placeholder.com/50" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mở modal thêm mới
  const handleShowAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  // Mở modal sửa
  const handleShowEdit = (product) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  // Xử lý Lưu (Thêm mới hoặc Cập nhật)
  const handleSave = (formData) => {
    if (editingProduct) {
      // Logic sửa
      setProducts(products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p));
    } else {
      // Logic thêm mới
      const newProduct = { ...formData, id: Date.now() }; // Tạo ID giả bằng timestamp
      setProducts([...products, newProduct]);
    }
    setShowModal(false);
  };

  // Xử lý Xóa
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  // Logic lọc tìm kiếm
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold mb-0">Quản lý Sản phẩm</h2>
        <Button variant="success" onClick={handleShowAdd}>
            <FaPlus className="me-2" /> Thêm sản phẩm
        </Button>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white py-3">
            <InputGroup style={{ maxWidth: '300px' }}>
                <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                <Form.Control 
                    placeholder="Tìm kiếm sản phẩm..." 
                    className="border-start-0 ps-0"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
                <thead className="bg-light text-secondary">
                    <tr>
                        <th className="ps-4">Sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá bán</th>
                        <th>Tồn kho</th>
                        <th>Trạng thái</th>
                        <th className="text-end pe-4">Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProducts.length > 0 ? filteredProducts.map(product => (
                        <tr key={product.id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={product.image} alt="" className="rounded border" style={{width: '40px', height: '40px', objectFit:'cover'}} />
                                    <span className="fw-medium">{product.name}</span>
                                </div>
                            </td>
                            <td><Badge bg="light" text="dark" className="border">{product.category}</Badge></td>
                            <td className="fw-bold">{Number(product.price).toLocaleString()} đ</td>
                            <td>{product.stock}</td>
                            <td>
                                {product.stock > 0 
                                    ? <Badge bg="success">Còn hàng</Badge> 
                                    : <Badge bg="danger">Hết hàng</Badge>
                                }
                            </td>
                            <td className="text-end pe-4">
                                <Button variant="link" className="text-primary p-0 me-3" onClick={() => handleShowEdit(product)}>
                                    <FaEdit />
                                </Button>
                                <Button variant="link" className="text-danger p-0" onClick={() => handleDelete(product.id)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="text-center py-4 text-muted">Không tìm thấy sản phẩm nào.</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Card.Body>
        <Card.Footer className="bg-white py-3 text-end">
             {/* Phân trang giả lập nếu cần */}
             <small className="text-muted">Hiển thị {filteredProducts.length} sản phẩm</small>
        </Card.Footer>
      </Card>

      {/* Modal Form */}
      <ProductModal 
        show={showModal} 
        handleClose={() => setShowModal(false)} 
        handleSave={handleSave}
        editingProduct={editingProduct}
      />
    </div>
  );
};

export default ProductManager;