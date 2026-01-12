import React from "react";
import { Card, Badge } from "react-bootstrap";
import { FaShoppingCart, FaEye, FaBolt, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import '../../assets/styles/products.css'; // Import CSS

const ProductCard = ({ product, onQuickView }) => {
  return (
    <Card className="h-100 border-0 product-card-wrapper">
      <div className="product-img-container">
          {/* Label Sale */}
          {product.salePrice && (
            <Badge bg="danger" className="position-absolute top-0 start-0 m-3 py-2 px-3 rounded-pill shadow-sm" style={{zIndex: 3}}>
              -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
            </Badge>
          )}
          
          <img src={product.image} alt={product.name} />
          
          {/* OVERLAY BUTTONS (Chỉ hiện khi hover ở Desktop) */}
          <div className="card-actions-overlay">
              <Link to={`/product/${product.id}`} className="action-btn">
                  <FaEye /> Chi tiết
              </Link>
              {/* Nút Xem Nhanh (Gọi hàm từ cha nếu có, hoặc alert) */}
              <button 
                className="action-btn" 
                onClick={(e) => {
                    e.preventDefault();
                    if(onQuickView) onQuickView(product);
                    else alert("Tính năng xem nhanh đang phát triển!");
                }}
              >
                  <FaBolt /> Xem nhanh
              </button>
          </div>

          {/* Nút tim yêu thích (Luôn hiện) */}
          <button 
            className="position-absolute top-0 end-0 m-3 btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center text-danger"
            style={{width: 35, height: 35, zIndex: 3}}
          >
            <FaHeart size={14}/>
          </button>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        <div className="text-muted small text-uppercase fw-bold mb-1" style={{fontSize: '0.75rem'}}>
            {product.category || 'Thực phẩm'}
        </div>
        
        <Card.Title className="fs-6 mb-2">
          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark fw-bold text-truncate-2-lines">
            {product.name}
          </Link>
        </Card.Title>

        <div className="mt-auto">
            <div className="d-flex align-items-center gap-2 mb-3">
                <span className="fw-bold text-success fs-5">
                    {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()} đ
                </span>
                {product.salePrice && (
                    <span className="text-muted text-decoration-line-through small">
                    {product.price.toLocaleString()} đ
                    </span>
                )}
            </div>
            
            <button className="btn btn-outline-success w-100 rounded-pill fw-bold d-flex align-items-center justify-content-center gap-2">
                <FaShoppingCart /> Thêm
            </button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;