import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Row, Col, InputGroup, Nav, Tab } from 'react-bootstrap';
import { FaSave, FaTimes, FaDollarSign, FaBoxOpen, FaImage, FaCloudUploadAlt } from 'react-icons/fa';

const DEFAULT_VALUES = {
    name: '',
    category: '', 
    price_cents: '', 
    stock: '',
    description: '',
    imageUrl: '', 
    preview: 'https://placehold.co/300x300?text=No+Image'
};

const ProductModal = ({ show, handleClose, product, onSave, categories = [] }) => {
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('url'); // 'url' hoặc 'file'

  // Init State
  const [formData, setFormData] = useState(() => {
      if (product) {
          const img = product.images?.[0]?.imageUrl || '';
          return {
              id: product._id || product.id,
              name: product.name,
              category: typeof product.categoryId === 'object' ? product.categoryId._id : product.categoryId,
              price_cents: product.price_cents,
              stock: product.variants?.[0]?.stock || (product.stock || 0),
              description: product.description || '',
              imageUrl: img,
              preview: img || DEFAULT_VALUES.preview
          };
      }
      return DEFAULT_VALUES;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 1. Xử lý nhập URL
  const handleUrlChange = (e) => {
      const url = e.target.value;
      setFormData({ 
          ...formData, 
          imageUrl: url,
          preview: url || DEFAULT_VALUES.preview 
      });
  };

  // 2. Xử lý chọn File (Convert to Base64)
  const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              // reader.result chứa chuỗi Base64 rất dài
              setFormData({
                  ...formData,
                  imageUrl: reader.result, // Lưu chuỗi base64 vào luôn field imageUrl
                  preview: reader.result
              });
          };
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price_cents || !formData.category) {
        alert("Vui lòng điền tên, danh mục và giá!");
        return;
    }
    
    const payload = {
        name: formData.name,
        categoryId: formData.category,
        price_cents: Number(formData.price_cents),
        description: formData.description,
        // Backend nhận mảng images object
        images: formData.imageUrl ? [{ imageUrl: formData.imageUrl }] : [],
        brand: "EcoStore", 
        // Giả lập variants để lưu stock
        variants: [{ 
            name: "Default", 
            price_cents: Number(formData.price_cents),
            stock: Number(formData.stock) || 0 
        }]
    };
    
    if (formData.id) payload.id = formData.id;

    onSave(payload);
    handleClose(); // Đóng modal ngay (trải nghiệm người dùng tốt hơn)
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
            {/* CỘT TRÁI: ẢNH */}
            <Col xs={12} md={4} className="mb-4 mb-md-0">
                <div className="text-center mb-3">
                    <div className="rounded-4 overflow-hidden border bg-light mx-auto position-relative" style={{ height: '250px', width: '100%', maxWidth: '300px' }}>
                        <img 
                            src={formData.preview} 
                            alt="Preview" 
                            className="w-100 h-100 object-fit-cover" 
                            onError={(e) => e.target.src = DEFAULT_VALUES.preview}
                        />
                    </div>
                </div>

                <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
                    <Nav variant="pills" className="justify-content-center mb-3 text-small">
                        <Nav.Item>
                            <Nav.Link eventKey="url" className="py-1 px-3" style={{fontSize: '0.9rem'}}>Link URL</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="file" className="py-1 px-3" style={{fontSize: '0.9rem'}}>Tải ảnh lên</Nav.Link>
                        </Nav.Item>
                    </Nav>

                    <Tab.Content>
                        <Tab.Pane eventKey="url">
                            <InputGroup size="sm">
                                <InputGroup.Text><FaImage/></InputGroup.Text>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Dán link ảnh..." 
                                    value={activeTab === 'url' ? formData.imageUrl : ''} // Chỉ hiện value nếu đang ở tab url (logic hiển thị)
                                    onChange={handleUrlChange}
                                />
                            </InputGroup>
                            <Form.Text className="text-muted small d-block mt-1">Dùng link ảnh có sẵn trên mạng.</Form.Text>
                        </Tab.Pane>
                        
                        <Tab.Pane eventKey="file">
                            <div 
                                className="border border-dashed rounded p-3 text-center cursor-pointer hover-bg-light"
                                onClick={() => fileInputRef.current.click()}
                                style={{cursor: 'pointer'}}
                            >
                                <FaCloudUploadAlt size={24} className="text-success mb-2"/>
                                <div className="small fw-bold">Chọn ảnh từ máy</div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="d-none" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <Form.Text className="text-muted small d-block mt-1 text-center">Ảnh sẽ được nén vào database.</Form.Text>
                        </Tab.Pane>
                    </Tab.Content>
                </Tab.Container>
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