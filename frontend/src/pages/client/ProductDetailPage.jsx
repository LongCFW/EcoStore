import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Badge,
  Form,
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  FaShoppingCart,
  FaHeart,
  FaMinus,
  FaPlus,
  FaStar,
} from "react-icons/fa";
import ProductCard from "../../components/product/ProductCard"; // Tái sử dụng để làm phần "Sản phẩm liên quan"

const ProductDetailPage = () => {
  const { id } = useParams(); // Lấy ID từ URL
  const [quantity, setQuantity] = useState(1);

  // Hàm tăng giảm số lượng (Logic UI tạm thời)
  const handleQuantityChange = (type) => {
    if (type === "decrease" && quantity > 1) setQuantity(quantity - 1);
    if (type === "increase") setQuantity(quantity + 1);
  };

  // Dữ liệu giả chi tiết cho 1 sản phẩm (Sau này sẽ fetch API dựa vào ID)
  const product = {
    id: id,
    name: "Bàn chải tre Eco thân thiện môi trường",
    price: 50000,
    salePrice: 45000,
    description:
      "Bàn chải tre được làm từ 100% tre tự nhiên, lông bàn chải mềm mại, giúp bảo vệ nướu và làm sạch răng hiệu quả. Sản phẩm có thể phân hủy sinh học hoàn toàn.",
    category: "Chăm sóc cá nhân",
    sku: "BCT-001",
    rating: 4.5,
    reviews: 120,
    stock: 50,
    images: [
      "https://via.placeholder.com/600",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
      "https://via.placeholder.com/150",
    ],
  };

  // Dữ liệu giả cho sản phẩm liên quan
  const relatedProducts = [
    {
      id: 2,
      name: "Kem đánh răng thảo mộc",
      price: 85000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Chỉ nha khoa tự nhiên",
      price: 30000,
      salePrice: 25000,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Cốc súc miệng tre",
      price: 60000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      name: "Khăn mặt sợi tre",
      price: 45000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <Container className="py-5">
      {/* Phần Thông tin chính */}
      <Row className="mb-5">
        {/* Cột Trái: Hình ảnh */}
        <Col md={6}>
          <div className="mb-3">
            <img
              src={product.images[0]}
              alt={product.name}
              className="img-fluid rounded shadow-sm w-100"
            />
          </div>
          <div className="d-flex gap-2 overflow-auto">
            {product.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img}
                alt=""
                className="rounded border"
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </Col>

        {/* Cột Phải: Thông tin */}
        <Col md={6}>
          <div className="mb-3">
            <Badge bg="success" className="me-2">
              Còn hàng
            </Badge>
            <span className="text-muted">SKU: {product.sku}</span>
          </div>

          <h1 className="fw-bold mb-3">{product.name}</h1>

          <div className="mb-3 text-warning fs-5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(product.rating) ? "text-warning" : "text-muted"
                }
              />
            ))}
            <span className="text-muted ms-2 fs-6">
              ({product.reviews} đánh giá)
            </span>
          </div>

          <div className="mb-4">
            <span className="fs-3 fw-bold text-primary me-3">
              {product.salePrice?.toLocaleString()} đ
            </span>
            {product.salePrice && (
              <span className="text-decoration-line-through text-muted fs-5">
                {product.price.toLocaleString()} đ
              </span>
            )}
          </div>

          <p className="text-muted mb-4">{product.description}</p>

          {/* Bộ chọn số lượng */}
          <div className="d-flex align-items-center mb-4">
            <span className="me-3 fw-bold">Số lượng:</span>
            <div className="input-group" style={{ width: "130px" }}>
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange("decrease")}
              >
                <FaMinus />
              </Button>
              <Form.Control className="text-center" value={quantity} readOnly />
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange("increase")}
              >
                <FaPlus />
              </Button>
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="d-flex gap-3">
            <Button variant="success" size="lg" className="flex-grow-1">
              <FaShoppingCart className="me-2" /> Thêm vào giỏ
            </Button>
            <Button variant="outline-danger" size="lg">
              <FaHeart />
            </Button>
          </div>
        </Col>
      </Row>

      {/* Phần Tabs: Mô tả & Đánh giá */}
      <Row className="mb-5">
        <Col>
          <Tabs defaultActiveKey="description" className="mb-3">
            <Tab eventKey="description" title="Mô tả chi tiết">
              <div className="bg-white p-4 rounded shadow-sm">
                <p>Đây là phần mô tả chi tiết dài hơn của sản phẩm...</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </Tab>
            <Tab eventKey="reviews" title={`Đánh giá (${product.reviews})`}>
              <div className="bg-white p-4 rounded shadow-sm">
                <p>Chức năng đánh giá sẽ được cập nhật sau.</p>
              </div>
            </Tab>
          </Tabs>
        </Col>
      </Row>

      {/* Phần Sản phẩm liên quan */}
      <Row>
        <Col>
          <h3 className="fw-bold mb-4">Sản phẩm liên quan</h3>
          <Row xs={1} md={2} lg={4} className="g-4">
            {relatedProducts.map((item) => (
              <Col key={item.id}>
                <ProductCard product={item} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;
