import React, { useState } from "react";
import { Navbar, Container, Nav, Form, Button, Badge, Dropdown, Offcanvas } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle, FaSearch, FaLeaf, FaBars, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBoxOpen, FaHeart, FaUser } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";


const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Lấy user và hàm logout từ AuthContext
  const { user, logout } = useAuth(); // <--- SỬ DỤNG HOOK

  // Logic kiểm tra login thật sự
  const isLoggedIn = !!user; // Nếu có user object -> true
  const userAvatar = user?.avatarUrl || null; // Lấy avatar từ user object (nếu có)
  const userName = user?.name || "User"; // Lấy tên user

  return (
    <>
      <Navbar expand="lg" className="sticky-top py-3" style={{ zIndex: 1020 }}>
        <Container>
          {/* 1. LOGO */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center gap-2 me-lg-5">
            <div className="bg-success bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center">
               <FaLeaf className="text-success" />
            </div>
            <span className="text-gradient">EcoStore</span>
          </Navbar.Brand>

          {/* Nút Mobile Menu */}
          <Button 
            variant="link" 
            className="d-lg-none text-success border-0 fs-2 p-0 ms-auto me-3"
            onClick={() => setShowMobileMenu(true)}
          >
            <FaBars />
          </Button>

          {/* Giỏ hàng Mobile */}
          <div className="d-flex align-items-center gap-2 d-lg-none">
             <Link to="/cart" className="position-relative text-success">
                <FaShoppingCart size={22} />
                <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-light" style={{fontSize: '0.6rem'}}>3</Badge>
             </Link>
          </div>

          {/* 2. MENU DESKTOP */}
          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            {/* Search Bar */}
            <div className="mx-auto w-100 px-lg-5" style={{ maxWidth: '600px' }}>
                <Form className="d-flex position-relative w-100">
                    <Form.Control
                        type="search"
                        placeholder="Tìm kiếm sản phẩm xanh..."
                        className="rounded-pill border-0 bg-light py-2 ps-4 pe-5 shadow-sm"
                        style={{ fontSize: '0.95rem' }}
                    />
                    <Button variant="link" className="position-absolute top-50 end-0 translate-middle-y text-success pe-3">
                        <FaSearch />
                    </Button>
                </Form>
            </div>

            {/* Menu Links & Actions */}
            <div className="d-flex align-items-center gap-4">
                {/* Menu Text */}
                <Nav className="d-flex gap-3 fw-medium">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Sản phẩm</NavLink>
                    <NavLink to="/offers" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Ưu đãi</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Giới thiệu</NavLink>
                </Nav>

                <div className="vr text-secondary opacity-25" style={{height: '25px'}}></div>

                {/* Actions Icons */}
                <div className="d-flex align-items-center gap-3">
                    {/* Giỏ hàng */}
                    <Link to="/cart" className="position-relative btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center text-success cart-icon-hover" style={{width: 42, height: 42}}>
                        <FaShoppingCart size={18} />
                        <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-2 border-white">3</Badge>
                    </Link>

                    
                    {/* --- USER ICON DROPDOWN (SỬA ĐỔI) --- */}
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="transparent" className="p-0 border-0 after-none">
                            {/* Icon này luôn hiển thị dù login hay chưa */}
                            <div className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm user-icon-hover border border-success" style={{width: 42, height: 42}}>
                                {isLoggedIn && userAvatar ? (
                                    <img src={userAvatar} alt="User" className="rounded-circle w-100 h-100 object-fit-cover" />
                                ) : (
                                    // Dùng icon màu xanh trên nền trắng cho nổi bật
                                    <FaUserCircle size={24} className="text-success"/> 
                                )}
                            </div>
                        </Dropdown.Toggle>

                        {/* Menu xổ xuống (Giữ nguyên logic cũ) */}
                        <Dropdown.Menu className="border-0 shadow-lg p-2 mt-3 rounded-4 animate-slide-up" style={{minWidth: '240px'}}>
                            {isLoggedIn ? (
                                <>
                                    <div className="px-3 py-2 border-bottom mb-2 bg-light rounded-top-3 mx-n2 mt-n2">
                                        <div className="fw-bold text-dark">Xin chào {userName}</div>
                                        <small className="text-muted">{user?.email}</small>
                                    </div>
                                    <Dropdown.Item as={Link} to="/profile" className="rounded-2 py-2 mb-1 fw-medium"><FaUserCircle className="me-2 text-success"/> Tài khoản</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/profile?tab=orders" className="rounded-2 py-2 mb-1 fw-medium"><FaBoxOpen className="me-2 text-primary"/> Đơn mua</Dropdown.Item>
                                    <Dropdown.Item as={Link} to="/profile?tab=wishlist" className="rounded-2 py-2 mb-1 fw-medium"><FaHeart className="me-2 text-danger"/> Yêu thích</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item onClick={logout} className="text-danger rounded-2 py-2 fw-bold"><FaSignOutAlt className="me-2"/> Đăng xuất</Dropdown.Item>
                                </>
                            ) : (
                                <>
                                    <div className="px-3 py-2 text-center">
                                        <span className="fw-bold d-block mb-1">Chào mừng bạn!</span>
                                        <small className="text-muted">Đăng nhập để mua sắm dễ dàng hơn</small>
                                    </div>
                                    <div className="p-2 d-grid gap-2">
                                        <Button as={Link} to="/login" variant="success" className="rounded-pill fw-bold btn-sm shadow-sm">
                                            <FaSignInAlt className="me-2"/> Đăng nhập
                                        </Button>
                                        <Button as={Link} to="/register" variant="outline-success" className="rounded-pill fw-bold btn-sm">
                                            <FaUserPlus className="me-2"/> Đăng ký
                                        </Button>
                                    </div>
                                    {/* Link Profile tạm để test */}
                                    <Dropdown.Divider />
                                    <Dropdown.Item as={Link} to="/profile" className="text-center small text-muted">Xem Profile (Demo)</Dropdown.Item>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MOBILE MENU */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end" className="border-0 rounded-start-4">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-success d-flex align-items-center gap-2">
             <FaLeaf /> EcoStore
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column px-4">
            <Form className="mb-4 mt-2">
                <Form.Control type="search" placeholder="Tìm kiếm..." className="rounded-pill bg-light border-0 py-2" />
            </Form>

            <Nav className="flex-column gap-3 fs-5 fw-medium">
                <Nav.Link as={Link} to="/" onClick={() => setShowMobileMenu(false)} className="border-bottom pb-2">Trang chủ</Nav.Link>
                <Nav.Link as={Link} to="/products" onClick={() => setShowMobileMenu(false)} className="border-bottom pb-2">Sản phẩm</Nav.Link>
                <Nav.Link as={Link} to="/offers" onClick={() => setShowMobileMenu(false)} className="border-bottom pb-2">Ưu đãi</Nav.Link>
                <Nav.Link as={Link} to="/about" onClick={() => setShowMobileMenu(false)} className="border-bottom pb-2">Giới thiệu</Nav.Link>
            </Nav>

            <div className="mt-auto mb-4">
                {isLoggedIn ? (
                    <div className="d-grid gap-2">
                        <Button as={Link} to="/profile" variant="outline-dark" className="justify-content-center d-flex align-items-center gap-2 py-2 rounded-pill">
                            <FaUserCircle /> Quản lý tài khoản
                        </Button>
                        <Button variant="danger" className="justify-content-center d-flex align-items-center gap-2 py-2 rounded-pill">
                            <FaSignOutAlt /> Đăng xuất
                        </Button>
                    </div>
                ) : (
                    <div className="d-grid gap-3">
                        <Button as={Link} to="/login" variant="success" size="lg" onClick={() => setShowMobileMenu(false)} className="rounded-pill fw-bold shadow-sm">Đăng nhập</Button>
                        <Button as={Link} to="/register" variant="outline-success" size="lg" onClick={() => setShowMobileMenu(false)} className="rounded-pill fw-bold">Đăng ký</Button>
                    </div>
                )}
            </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;