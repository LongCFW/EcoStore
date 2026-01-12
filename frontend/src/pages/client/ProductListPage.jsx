import React from "react";
import { Container, Row, Col, Form, Pagination } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard";
import ProductFilter from "../../components/product/ProductFilter";

const ProductListPage = () => {
  // Dữ liệu giả định
  const products = [
    {
      id: 1,
      name: "Bàn chải tre Eco",
      price: 50000,
      salePrice: 45000,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 2,
      name: "Túi vải Canvas",
      price: 120000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 3,
      name: "Bình giữ nhiệt",
      price: 250000,
      salePrice: 199000,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 4,
      name: "Xà phòng thảo mộc",
      price: 80000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 5,
      name: "Ống hút inox",
      price: 30000,
      salePrice: null,
      image: "https://via.placeholder.com/300",
    },
    {
      id: 6,
      name: "Hộp cơm lúa mạch",
      price: 150000,
      salePrice: 120000,
      image: "https://via.placeholder.com/300",
    },
  ];

  return (
    <Container className="py-5">
      <Row>
        {/* Cột trái: Bộ lọc (ẩn trên mobile nếu muốn xử lý responsive kỹ hơn sau này) */}
        <Col lg={3} className="mb-4">
          <ProductFilter />
        </Col>

        {/* Cột phải: Danh sách sản phẩm */}
        <Col lg={9}>
          {/* Thanh công cụ: Sắp xếp & Số lượng */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <span className="text-muted">
              Hiển thị {products.length} sản phẩm
            </span>
            <Form.Select style={{ width: "200px" }}>
              <option>Mới nhất</option>
              <option>Giá: Thấp đến Cao</option>
              <option>Giá: Cao đến Thấp</option>
              <option>Bán chạy nhất</option>
            </Form.Select>
          </div>

          {/* Lưới sản phẩm */}
          <Row xs={1} md={2} lg={3} className="g-4 mb-5">
            {products.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <Pagination className="justify-content-center">
            <Pagination.Prev />
            <Pagination.Item active>{1}</Pagination.Item>
            <Pagination.Item>{2}</Pagination.Item>
            <Pagination.Item>{3}</Pagination.Item>
            <Pagination.Next />
          </Pagination>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductListPage;
