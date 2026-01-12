import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaShoppingCart, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 border-0 overflow-hidden product-card">
      {/* Container ảnh để xử lý hover zoom sau này */}
      <div className="position-relative overflow-hidden" style={{height: '250px'}}>
          {/* Label giảm giá */}
          {product.salePrice && (
            <Badge bg="danger" className="position-absolute top-0 start-0 m-3 py-2 px-3 rounded-pill shadow-sm" style={{zIndex: 2}}>
              Sale
            </Badge>
          )}
          
          <Link to={`/product/${product.id}`}>
            <Card.Img
              variant="top"
              src={product.image}
              alt={product.name}
              className="w-100 h-100 object-fit-cover transition-transform"
              // Thêm inline style tạm thời, sau này CSS class sẽ lo
              style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
            />
          </Link>
          
          {/* Nút yêu thích bay lơ lửng */}
          <Button 
            variant="light" 
            className="position-absolute top-0 end-0 m-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm text-danger"
            style={{width: 35, height: 35, zIndex: 2}}
          >
            <FaHeart size={14}/>
          </Button>
      </div>

      <Card.Body className="d-flex flex-column p-3">
        {/* Category nhỏ */}
        <small className="text-success fw-bold text-uppercase mb-1" style={{fontSize: '0.7rem'}}>
            {product.category || 'Eco Friendly'}
        </small>

        <Card.Title className="fs-6 mb-2">
          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark fw-bold text-truncate-2-lines">
            {product.name}
          </Link>
        </Card.Title>

        {/* Giá cả */}
        <div className="mb-3 d-flex align-items-center gap-2">
          <span className="fw-bold text-success fs-5">
            {product.salePrice ? product.salePrice.toLocaleString() : product.price.toLocaleString()} đ
          </span>
          {product.salePrice && (
            <span className="text-muted text-decoration-line-through small">
              {product.price.toLocaleString()} đ
            </span>
          )}
        </div>

        {/* Nút thêm vào giỏ */}
        <div className="mt-auto">
          <Button
            variant="outline-success"
            className="w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-bold border-2"
          >
            <FaShoppingCart /> Thêm vào giỏ
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;