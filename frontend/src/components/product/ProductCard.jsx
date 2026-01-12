import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { FaShoppingCart, FaHeart } from "react-icons/fa"; // Import icon
import { Link } from "react-router-dom";

// Component này nhận vào một prop là object "product"
const ProductCard = ({ product }) => {
  return (
    <Card className="h-100 shadow-sm border-0">
      {/* Label giảm giá nếu có */}
      {product.salePrice && (
        <Badge bg="danger" className="position-absolute top-0 start-0 m-2">
          Sale
        </Badge>
      )}

      {/* Hình ảnh sản phẩm - Click vào sẽ ra chi tiết */}
      <Link to={`/product/${product.id}`}>
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          style={{ height: "200px", objectFit: "cover" }}
        />
      </Link>

      <Card.Body className="d-flex flex-column">
        <Card.Title className="fs-6 text-truncate">
          <Link
            to={`/product/${product.id}`}
            className="text-decoration-none text-dark"
          >
            {product.name}
          </Link>
        </Card.Title>

        <div className="mb-2">
          <span className="fw-bold text-primary me-2">
            {product.salePrice
              ? product.salePrice.toLocaleString()
              : product.price.toLocaleString()}{" "}
            đ
          </span>
          {product.salePrice && (
            <span className="text-muted text-decoration-line-through small">
              {product.price.toLocaleString()} đ
            </span>
          )}
        </div>

        <div className="mt-auto d-flex gap-2">
          <Button
            variant="outline-primary"
            className="w-100 d-flex align-items-center justify-content-center gap-1"
          >
            <FaShoppingCart /> Thêm
          </Button>
          <Button variant="outline-danger">
            <FaHeart />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
