import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup } from 'react-bootstrap';
import { FaSave, FaTimes, FaDollarSign, FaBoxOpen, FaImage } from 'react-icons/fa';

// Giá trị mặc định
const DEFAULT_VALUES = {
    name: '',
    category: '', // Để trống để bắt buộc chọn
    price_cents: '', // Đổi tên field cho khớp Backend (price -> price_cents)
    salePrice: '',   // Cần map sang compareAtPriceCents nếu backend dùng tên đó
    stock: '',
    description: '',
    // Thay đổi logic ảnh: lưu mảng images chứa object { imageUrl: ... }
    imageUrl: '', // Dùng tạm state này để bind vào input URL
    preview: 'https://via.placeholder.com/300x300?text=No+Image'
};

const ProductModal = ({ show, handleClose, product, onSave, categories = [] }) => {
  // Init State
  const [formData, setFormData] = useState(() => {
      if (product) {
          // Map dữ liệu từ Product (Backend) vào Form
          return {
              name: product.name,
              category: typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId,
              price_cents: product.price_cents,
              // Nếu backend chưa có salePrice, tạm để trống hoặc lấy từ compareAtPriceCents
              stock: product.variants?.[0]?.stock || 100, // Tạm lấy stock
              description: product.description || '',
              // Lấy ảnh đầu tiên ra hiển thị
              imageUrl: product.images?.[0]?.imageUrl || '',
              preview: product.images?.[0]?.imageUrl || DEFAULT_VALUES.preview
          };
      }
      return DEFAULT_VALUES;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Xử lý khi nhập URL ảnh (Hiển thị preview ngay)
  const handleUrlChange = (e) => {
      const url = e.target.value;
      setFormData({ 
          ...formData, 
          imageUrl: url,
          preview: url || DEFAULT_VALUES.preview 
      });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price_cents || !formData.category) {
        alert("Vui lòng điền tên, danh mục và giá!");
        return;
    }
    
    // Chuẩn bị dữ liệu gửi về (Map lại cho đúng Schema Backend)
    const payload = {
        name: formData.name,
        categoryId: formData.category, // Backend cần categoryId
        price_cents: Number(formData.price_cents),
        description: formData.description,
        // Tạo cấu trúc images chuẩn Schema
        images: formData.imageUrl ? [{ imageUrl: formData.imageUrl }] : [],
        // Tạm thời hardcode brand để backend không lỗi validation (nếu có)
        brand: "EcoStore", 
        // Backend đang dùng variants để lưu stock, ta cần xử lý tạm
        // Hoặc nếu backend đã bỏ variants bắt buộc thì ok.
        // Giả sử backend tự xử lý hoặc ta gửi variants ảo:
        variants: [{ 
            name: "Default", 
            price_cents: Number(formData.price_cents),
            stock: Number(formData.stock) || 0 
        }]
    };
    
    // Gửi kèm ID nếu là sửa
    if (product) payload.id = product.id || product._id;

    onSave(payload);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" scrollable backdrop="static">
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success fs-5">
            {product ? 'Cập Nhật Sản Phẩm' : 'Thêm Sản Phẩm Mới'}
        </Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
      </Modal.Header>
      
      <Modal.Body className="p-4 custom-scrollbar">
        <Row>
            {/* CỘT TRÁI: ẢNH (NHẬP URL) */}
            <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                <div className="rounded-4 overflow-hidden border bg-light mb-3 mx-auto" style={{ height: '250px', width: '100%', maxWidth: '300px' }}>
                    <img src={formData.preview} alt="Preview" className="w-100 h-100 object-fit-cover" 
                         onError={(e) => e.target.src = DEFAULT_VALUES.preview}/>
                </div>
                <Form.Group>
                    <Form.Label className="admin-label small">URL Hình ảnh</Form.Label>
                    <InputGroup size="sm">
                        <InputGroup.Text><FaImage/></InputGroup.Text>
                        <Form.Control 
                            type="text" 
                            placeholder="Paste link ảnh vào đây..." 
                            value={formData.imageUrl}
                            onChange={handleUrlChange}
                        />
                    </InputGroup>
                    <Form.Text className="text-muted small">
                        Copy link ảnh từ internet và dán vào đây.
                    </Form.Text>
                </Form.Group>
            </Col>

            {/* CỘT PHẢI: FORM */}
            <Col xs={12} md={8}>
                <Form>
                    <Row className="g-3">
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label className="admin-label">Tên sản phẩm <span className="text-danger">*</span></Form.Label>
                                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} className="admin-input" placeholder="Nhập tên sản phẩm..." />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Danh mục <span className="text-danger">*</span></Form.Label>
                                <Form.Select name="category" value={formData.category} onChange={handleChange} className="admin-input">
                                    <option value="">-- Chọn danh mục --</option>
                                    {categories.map(cat => (
                                        <option key={cat._id} value={cat._id}>{cat.name}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Tồn kho</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0"><FaBoxOpen className="text-muted"/></InputGroup.Text>
                                    <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} className="admin-input border-start-0 ps-0" placeholder="0" />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Giá bán (VNĐ) <span className="text-danger">*</span></Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0"><FaDollarSign className="text-muted"/></InputGroup.Text>
                                    <Form.Control type="number" name="price_cents" value={formData.price_cents} onChange={handleChange} className="admin-input border-start-0 ps-0" placeholder="0" />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label className="admin-label">Mô tả ngắn</Form.Label>
                                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} className="admin-input" placeholder="Mô tả sản phẩm..." />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
      </Modal.Body>
      
      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Hủy bỏ</Button>
        <Button variant="success" onClick={handleSubmit} className="rounded-pill px-4 fw-bold shadow-sm">
            <FaSave className="me-2"/> Lưu Sản Phẩm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;