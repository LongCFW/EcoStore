import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';

const ProductModal = ({ show, handleClose, handleSave, editingProduct }) => {
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    category: 'Gia dụng',
    price: 0,
    stock: 0,
    image: '',
    description: ''
  });

  // FIX HOÀN CHỈNH: Chỉ chạy reset form KHI VÀ CHỈ KHI biến 'show' thay đổi
  useEffect(() => {
    if (show) {
        if (editingProduct) {
            setFormData(editingProduct);
        } else {
            setFormData({
                name: '',
                category: 'Gia dụng',
                price: 0,
                stock: 0,
                image: '',
                description: ''
            });
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]); // Chỉ theo dõi biến 'show', bỏ qua editingProduct để tránh loop

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.price) {
        alert("Vui lòng nhập tên và giá sản phẩm!");
        return;
    }
    handleSave(formData);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} placeholder="VD: Bàn chải tre" />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select name="category" value={formData.category} onChange={handleChange}>
                            <option>Gia dụng</option>
                            <option>Chăm sóc cá nhân</option>
                            <option>Vệ sinh nhà cửa</option>
                            <option>Quà tặng</option>
                            <option>Thời trang</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá bán (VNĐ)</Form.Label>
                        <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} />
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Tồn kho</Form.Label>
                        <Form.Control type="number" name="stock" value={formData.stock} onChange={handleChange} />
                    </Form.Group>
                </Col>
            </Row>

            <Form.Group className="mb-3">
                <Form.Label>Link hình ảnh</Form.Label>
                <Form.Control type="text" name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                {formData.image && <img src={formData.image} alt="Preview" className="mt-2 rounded" style={{height: '80px'}} />}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Mô tả chi tiết</Form.Label>
                <Form.Control as="textarea" rows={3} name="description" value={formData.description} onChange={handleChange} />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>Hủy bỏ</Button>
        <Button variant="success" onClick={handleSubmit}>
            {editingProduct ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;