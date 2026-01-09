import React from "react";
import { Navbar, Container, Nav, Badge, Button, Form } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className="navbar-eco py-3 shadow-sm bg-white"
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          className="d-flex align-items-center gap-2 group"
        >
          <span
            style={{ fontSize: "1.8rem", color: "#2E7D32" }}
            className="transition-transform"
          >
            <i className="bi bi-leaf"></i> 🌿
          </span>
          <span
            className="fw-bold fs-3"
            style={{ color: "#2E7D32", letterSpacing: "-1px" }}
          >
            EcoStore
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Form
            className="d-flex mx-auto my-2 my-lg-0"
            style={{ maxWidth: "400px", width: "100%" }}
          >
            <Form.Control
              type="search"
              placeholder="Tìm kiếm sản phẩm xanh..."
              className="me-2 rounded-pill border-success bg-light"
              aria-label="Search"
            />
          </Form>

          <Nav className="ms-auto align-items-center gap-3">
            <Nav.Link as={Link} to="/" active={location.pathname === "/"}>
              Trang chủ
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/products"
              active={location.pathname === "/products"}
            >
              Cửa hàng
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/about"
              active={location.pathname === "/about"}
            >
              Về chúng tôi
            </Nav.Link>

            <div className="vr d-none d-lg-block"></div>
        
            <Button
              as={Link}
              to="/cart"
              variant="outline-primary"
              className="rounded-circle p-2 position-relative border-0"
            >
              <i className="bi bi-cart3 fs-5"></i>
              <Badge
                bg="danger"
                className="position-absolute top-0 start-100 translate-middle rounded-circle border border-2 border-white"
              >
                2
              </Badge>
            </Button>

            <Button
              variant="primary"
              as={Link}
              to="/login"
              className="rounded-pill px-4 shadow-sm"
            >
              Đăng nhập
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
