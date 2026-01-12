import React from "react";
import {
  Navbar,
  Container,
  Nav,
  Form,
  Button,
  Badge,
  NavDropdown,
} from "react-bootstrap";
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <Navbar bg="white" expand="lg" className="shadow-sm sticky-top py-3">
      <Container>
        {/* Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-success fs-4">
          EcoStore
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menu chính */}
          <Nav className="me-auto mb-2 mb-lg-0 ms-lg-4 fw-medium">
            <Nav.Link as={NavLink} to="/">
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products">
              Sản phẩm
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about">
              Giới thiệu
            </Nav.Link>
          </Nav>

          {/* Thanh tìm kiếm */}
          <Form className="d-flex flex-grow-1 mx-lg-5 my-2 my-lg-0">
            <div className="input-group">
              <Form.Control
                type="search"
                placeholder="Tìm kiếm sản phẩm..."
                aria-label="Search"
              />
              <Button variant="success">
                <FaSearch />
              </Button>
            </div>
          </Form>

          {/* Icon Giỏ hàng & User */}
          <Nav className="d-flex align-items-center gap-3">
            {/* Giỏ hàng */}
            <Link to="/cart" className="position-relative text-dark fs-5">
              <FaShoppingCart />
              <Badge
                bg="danger"
                pill
                className="position-absolute top-0 start-100 translate-middle"
                style={{ fontSize: "0.6rem" }}
              >
                3
              </Badge>
            </Link>

            {/* Tài khoản */}
            <NavDropdown
              title={<FaUser className="fs-5 text-dark" />}
              id="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/login">
                Đăng nhập
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">
                Đăng ký
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/profile">
                Tài khoản của tôi
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
