import React, { useState } from 'react';
import { Modal, Row, Col, Button, Badge, Form } from 'react-bootstrap';
import { FaShoppingCart, FaCheck, FaTimes, FaMinus, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const QuickViewModal = ({ show, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="quick-view-modal">
      <Modal.Header closeButton className="border-0 position-absolute end-0 top-0 z-3"></Modal.Header>
      <Modal.Body className="p-0">
        <Row className="g-0">
            {/* Cột trái: Ảnh */}
            <Col md={6} className="bg-light d-flex align-items-center justify-content-center p-3">
                <div className="position-relative w-100 h-100" style={{minHeight: '300px'}}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        className="img-fluid rounded shadow-sm w-100 h-100 object-fit-cover" 
                    />
                    {product.salePrice && (
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2 px-3 py-2">
                            Sale
                        </Badge>
                    )}
                </div>
            </Col>

            {/* Cột phải: Thông tin */}
            <Col md={6} className="p-4 d-flex flex-column">
                <div className="mb-2">
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success me-2">
                        {product.category || 'Sản phẩm Eco'}
                    </Badge>
                    <span className={`small ${product.stock !== 0 ? 'text-success' : 'text-danger'}`}>
                        {product.stock !== 0 ? <><FaCheck className="me-1"/>Còn hàng</> : <><FaTimes className="me-1"/>Hết hàng</>}
                    </span>
                </div>

                <h3 className="fw-bold mb-3">{product.name}</h3>
                
                <div className="mb-4">
                    <span className="display-6 fw-bold text-success me-3">
                        {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()} đ
                    </span>
                    {product.salePrice && (
                        <span className="text-muted text-decoration-line-through fs-5">
                            {product.price.toLocaleString()} đ
                        </span>
                    )}
                </div>

                <p className="text-muted small mb-4 flex-grow-1">
                    {product.description || "Sản phẩm xanh, sạch, thân thiện với môi trường. Đảm bảo chất lượng và an toàn cho sức khỏe người tiêu dùng."}
                </p>

                {/* Action Area */}
                <div className="pt-3 border-top">
                    <div className="d-flex gap-3 mb-3">
                        <div className="input-group border rounded-pill overflow-hidden" style={{width: '120px'}}>
                            <button className="btn btn-light border-0" onClick={() => handleQuantity('dec')}><FaMinus size={10}/></button>
                            <input type="text" className="form-control border-0 text-center bg-white fw-bold p-0" value={quantity} readOnly />
                            <button className="btn btn-light border-0" onClick={() => handleQuantity('inc')}><FaPlus size={10}/></button>
                        </div>
                        <Button variant="success" className="rounded-pill flex-grow-1 fw-bold shadow-sm">
                            <FaShoppingCart className="me-2"/> Thêm vào giỏ
                        </Button>
                    </div>
                    <Link to={`/product/${product.id}`} className="text-center d-block text-decoration-none small text-muted hover-green">
                        Xem chi tiết sản phẩm &rarr;
                    </Link>
                </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;