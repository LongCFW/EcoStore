import React from "react";
import { Row, Col, Button, Carousel } from "react-bootstrap";
import ProductCard from "../../components/product/ProductCard"; // Import ProductCard

const HomePage = () => {
  // Dữ liệu giả để test giao diện
  const dummyProducts = [
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
  ];

  return (
    <>
      {/* Phần Banner (Hero Section) */}
      <section className="mb-5">
        <div
          className="p-5 bg-success text-white rounded-3 shadow-sm d-flex align-items-center"
          style={{ minHeight: "300px" }}
        >
          <div>
            <h1 className="display-4 fw-bold">Sống Xanh Cùng EcoStore</h1>
            <p className="lead">
              Khám phá các sản phẩm thân thiện với môi trường, chất lượng cao.
            </p>
            <Button variant="light" size="lg" className="fw-bold text-success">
              Mua Ngay
            </Button>
          </div>
        </div>
      </section>

      {/* Phần Danh Sách Sản Phẩm Nổi Bật */}
      <section>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold">Sản phẩm nổi bật</h2>
          <Button variant="link" className="text-decoration-none">
            Xem tất cả &rarr;
          </Button>
        </div>

        <Row xs={1} md={2} lg={4} className="g-4">
          {dummyProducts.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default HomePage;
