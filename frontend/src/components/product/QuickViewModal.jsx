import React, { useState } from 'react'; // Added useEffect
import { Modal, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaCheck, FaTimes, FaMinus, FaPlus, FaStar, FaTimes as FaClose } from 'react-icons/fa'; // Import đủ icon
import { Link } from 'react-router-dom';
import AddToCartBtn from '../cart/AddToCartBtn';

const QuickViewModal = ({ show, handleClose, product }) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleQuantity = (type) => {
    if (type === 'inc') setQuantity(q => q + 1);
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
  };

  // Safe check for price to avoid toLocaleString error
  const displayPrice = product.salePrice || product.price || 0;
  const originalPrice = product.price || 0;
  
  // Mapping ID: Tùy vào product lấy từ đâu mà ID có thể là id hoặc _id
  const productId = product.id || product._id;
  
  // Mapping Image & Category
  const image = product.image || product.images?.[0]?.imageUrl || 'https://placehold.co/400';
  const categoryName = typeof product.categoryId === 'object' ? product.categoryId?.name : 'Sản phẩm Eco';

  const stock = product.variants?.[0]?.stock || product.stock || 0;
  // Check stock (nếu không có variants thì check stock, nếu có variants thì coi như còn hàng hoặc check variant đầu)
  const isOutOfStock = stock <= 0 && (!product.variants || product.variants.length === 0);

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="quick-view-modal">
      {/* Nút đóng modal ở góc */}
      <div className="position-absolute top-0 end-0 m-3" style={{zIndex: 10}}>
          <Button variant="light" className="rounded-circle shadow-sm" onClick={handleClose}>
              <FaClose />
          </Button>
      </div>

      <Modal.Body className="p-0 rounded-4 overflow-hidden bg-white">
        <Row className="g-0 h-100">
            {/* Left Column: Image */}
            <Col md={6} className="bg-light d-flex align-items-center justify-content-center p-4">
                <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center" style={{minHeight: '300px'}}>
                    <img 
                        src={image} 
                        alt={product.name} 
                        className="img-fluid rounded shadow-sm" 
                        style={{maxHeight: '400px', objectFit: 'contain'}}
                    />
                    {product.salePrice && (
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2 px-3 py-2">
                            Sale
                        </Badge>
                    )}
                </div>
            </Col>

            {/* Right Column: Info */}
            <Col md={6} className="p-4 d-flex flex-column">
                <div className="mb-2">
                    <Badge bg="success" className="bg-opacity-10 text-success border border-success me-2">
                        {categoryName}
                    </Badge>
                    <span className={`small fw-bold ${!isOutOfStock ? 'text-success' : 'text-danger'}`}>
                        {!isOutOfStock ? <><FaCheck className="me-1"/>Còn {stock} sản phẩm</> : <><FaTimes className="me-1"/>Hết hàng</>}
                    </span>
                </div>

                <h3 className="fw-bold mb-2">{product.name}</h3>
                
                {/* Rating giả lập cho đẹp */}
                <div className="d-flex align-items-center mb-3 text-warning small">
                    {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                    <span className="text-muted ms-2">(4.8/5)</span>
                </div>
                
                <div className="mb-4">
                    <span className="display-6 fw-bold text-success me-3">
                        {displayPrice.toLocaleString()} đ
                    </span>
                    {product.salePrice && (
                        <span className="text-muted text-decoration-line-through fs-5">
                            {originalPrice.toLocaleString()} đ
                        </span>
                    )}
                </div>

                <p className="text-muted small mb-4 flex-grow-1" style={{maxHeight: '100px', overflowY: 'auto', lineHeight: '1.6'}}>
                    {product.shortDescription || product.description || "Sản phẩm xanh, sạch, thân thiện với môi trường..."}
                </p>

                {/* Action Area */}
                <div className="pt-3 mt-auto">
                    <div className="d-flex gap-3 mb-3">
                        {/* Bộ chọn số lượng */}
                        <div className="input-group border rounded-pill overflow-hidden" style={{width: '120px', height: '48px'}}>
                            <button className="btn btn-light border-0 px-3" onClick={() => handleQuantity('dec')} disabled={quantity <= 1}><FaMinus size={10}/></button>
                            <input type="text" className="form-control border-0 text-center bg-white fw-bold p-0" value={quantity} readOnly />
                            <button className="btn btn-light border-0 px-3" onClick={() => handleQuantity('inc')}><FaPlus size={10}/></button>
                        </div>
                        
                        {/* NÚT ADD TO CART THẬT */}
                        <div className="flex-grow-1">
                            <AddToCartBtn 
                                productId={productId}
                                quantity={quantity} // Truyền số lượng đang chọn
                                className="w-100 rounded-pill fw-bold shadow-sm h-100"
                                size="lg"
                                disabled={isOutOfStock}
                            >
                            {isOutOfStock ? "Hết hàng" : "Thêm Ngay"}
                            </AddToCartBtn>
                        </div>
                    </div>
                    
                    <Link 
                        to={`/product/${product.slug}`} 
                        className="text-center d-block text-decoration-none small text-muted hover-green fw-medium"
                        onClick={handleClose} 
                    >
                        Xem chi tiết đầy đủ &rarr;
                    </Link>
                </div>
            </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;