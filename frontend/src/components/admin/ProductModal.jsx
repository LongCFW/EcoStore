import React, { useState, useRef } from 'react'; // Bỏ useEffect
import { Modal, Button, Form, Row, Col, InputGroup, Badge } from 'react-bootstrap';
import { FaCloudUploadAlt, FaSave, FaTimes, FaDollarSign, FaBoxOpen } from 'react-icons/fa';

// Giá trị mặc định
const DEFAULT_VALUES = {
    name: '',
    category: 'Rau củ',
    price: '',
    salePrice: '',
    stock: '',
    description: '',
    image: null,
    preview: 'https://via.placeholder.com/300x300?text=Upload+Image'
};

const ProductModal = ({ show, handleClose, product, onSave }) => {
  const fileInputRef = useRef(null);

  // KHỞI TẠO STATE TRỰC TIẾP TỪ PROPS (Không cần useEffect)
  // Khi key thay đổi, component remount, state sẽ được tính toán lại từ đầu
  const [formData, setFormData] = useState(() => {
      if (product) {
          return {
              ...product,
              preview: product.image || DEFAULT_VALUES.preview
          };
      }
      return DEFAULT_VALUES;
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData({ ...formData, image: file, preview: url });
    }
  };

  const handleSubmit = () => {
    if (!formData.name) {
        alert("Vui lòng nhập tên sản phẩm!");
        return;
    }
    
    onSave({
        ...formData,
        id: product ? product.id : undefined
    });
    
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
            {/* CỘT TRÁI: ẢNH */}
            <Col xs={12} md={4} className="text-center mb-4 mb-md-0">
                <div 
                    className="position-relative rounded-4 overflow-hidden border border-2 border-dashed border-success bg-light d-flex align-items-center justify-content-center mx-auto"
                    style={{ height: '250px', width: '100%', maxWidth: '300px', cursor: 'pointer' }}
                    onClick={() => fileInputRef.current.click()}
                >
                    <img 
                        src={formData.preview} 
                        alt="Preview" 
                        className="w-100 h-100 object-fit-cover" 
                        style={{opacity: (formData.image || (product && product.image)) ? 1 : 0.6}}
                    />
                    
                    <div className="position-absolute top-50 start-50 translate-middle text-center w-100 p-2" style={{pointerEvents: 'none', display: (formData.preview !== DEFAULT_VALUES.preview) ? 'none' : 'block'}}>
                        <FaCloudUploadAlt size={40} className="text-success mb-2"/>
                        <p className="small text-muted fw-bold m-0">Nhấn để tải ảnh lên</p>
                    </div>
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImageChange} 
                    style={{display: 'none'}} 
                    accept="image/*"
                />
            </Col>

            {/* CỘT PHẢI: FORM */}
            <Col xs={12} md={8}>
                <Form>
                    <Row className="g-3">
                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label className="admin-label">Tên sản phẩm</Form.Label>
                                <Form.Control 
                                    type="text" name="name" 
                                    value={formData.name} onChange={handleChange} 
                                    className="admin-input" placeholder="Nhập tên sản phẩm..."
                                />
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Danh mục</Form.Label>
                                <Form.Select 
                                    name="category" 
                                    value={formData.category} onChange={handleChange} 
                                    className="admin-input"
                                >
                                    <option>Rau củ</option>
                                    <option>Trái cây</option>
                                    <option>Đồ uống</option>
                                    <option>Đồ gia dụng</option>
                                    <option>Hạt & Ngũ cốc</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Tồn kho</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0"><FaBoxOpen className="text-muted"/></InputGroup.Text>
                                    <Form.Control 
                                        type="number" name="stock" 
                                        value={formData.stock} onChange={handleChange} 
                                        className="admin-input border-start-0 ps-0" placeholder="0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Giá gốc</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0"><FaDollarSign className="text-muted"/></InputGroup.Text>
                                    <Form.Control 
                                        type="number" name="price" 
                                        value={formData.price} onChange={handleChange} 
                                        className="admin-input border-start-0 ps-0" placeholder="0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={12} sm={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Giá khuyến mãi</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text className="bg-light border-end-0 text-danger"><FaDollarSign/></InputGroup.Text>
                                    <Form.Control 
                                        type="number" name="salePrice" 
                                        value={formData.salePrice} onChange={handleChange} 
                                        className="admin-input border-start-0 ps-0" placeholder="0"
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Col>

                        <Col xs={12}>
                            <Form.Group>
                                <Form.Label className="admin-label">Mô tả ngắn</Form.Label>
                                <Form.Control 
                                    as="textarea" rows={3} name="description" 
                                    value={formData.description} onChange={handleChange} 
                                    className="admin-input" placeholder="Mô tả sản phẩm..."
                                />
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