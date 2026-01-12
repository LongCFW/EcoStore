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
import { FaShoppingCart, FaUser, FaSearch, FaLeaf } from "react-icons/fa"; // Thêm FaLeaf
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  return (
    <Navbar expand="lg" className="sticky-top py-3" style={{zIndex: 1020}}>
      <Container>
        {/* Logo với Gradient Text */}
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center gap-2">
          <FaLeaf className="text-success" /> 
          <span className="text-gradient">EcoStore</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Menu chính - Căn giữa và hiệu ứng hover */}
          <Nav className="mx-auto mb-2 mb-lg-0 fw-medium gap-lg-4">
            <Nav.Link as={NavLink} to="/" className={({isActive}) => isActive ? "text-success fw-bold" : "text-dark hover-green"}>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={NavLink} to="/products" className={({isActive}) => isActive ? "text-success fw-bold" : "text-dark hover-green"}>
              Sản phẩm
            </Nav.Link>
            <Nav.Link as={NavLink} to="/offers" className={({isActive}) => isActive ? "text-success fw-bold" : "text-dark hover-green"}>
              Ưu đãi
            </Nav.Link>
            <Nav.Link as={NavLink} to="/about" className={({isActive}) => isActive ? "text-success fw-bold" : "text-dark hover-green"}>
              Giới thiệu
            </Nav.Link>
          </Nav>

          {/* Cụm Tìm kiếm & User - Gom nhóm lại trên Mobile */}
          <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3 mt-3 mt-lg-0">
            {/* Search Bar - Style bo tròn */}
            <Form className="d-flex position-relative">
              <Form.Control
                type="search"
                placeholder="Tìm sản phẩm xanh..."
                className="rounded-pill ps-4 border-success bg-white bg-opacity-50"
                style={{paddingRight: '40px', minWidth: '250px'}}
              />
              <Button variant="link" className="position-absolute top-50 end-0 translate-middle-y text-success p-2">
                <FaSearch />
              </Button>
            </Form>

            {/* Actions */}
            <div className="d-flex align-items-center gap-3 justify-content-between justify-content-lg-start">
                {/* Giỏ hàng */}
                <Link to="/cart" className="position-relative btn btn-light rounded-circle p-2 text-success shadow-sm d-flex align-items-center justify-content-center" style={{width: 45, height: 45}}>
                  <FaShoppingCart size={20} />
                  <Badge
                    bg="danger"
                    pill
                    className="position-absolute top-0 start-100 translate-middle border border-light"
                  >
                    3
                  </Badge>
                </Link>

                {/* Tài khoản */}
                <NavDropdown
                  title={<div className="d-flex align-items-center gap-2"><div className="btn btn-success rounded-circle p-0 d-flex align-items-center justify-content-center" style={{width: 35, height: 35}}><FaUser size={16} className="text-white"/></div> <span className="d-lg-none">Tài khoản</span></div>}
                  id="user-dropdown"
                  align="end"
                  className="shadow-none"
                >
                  <NavDropdown.Item as={Link} to="/login">Đăng nhập</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/register">Đăng ký</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile">Tài khoản của tôi</NavDropdown.Item>
                </NavDropdown>
            </div>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;