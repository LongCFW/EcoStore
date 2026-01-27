import React, { useState } from "react";
import { Navbar, Container, Nav, Form, Button, Badge, Dropdown, Offcanvas } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle, FaSearch, FaLeaf, FaBars, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBoxOpen, FaHeart } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth(); 
  const { cartCount } = useCart();    
  const isLoggedIn = !!user; 
  const userAvatar = user?.avatarUrl; 
  const userName = user?.name || "User";

  // --- LOGIC TÌM KIẾM MỚI ---
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
      e.preventDefault(); // Chặn reload trang
      if (searchTerm.trim()) {
          // Chuyển hướng sang trang Products kèm query param ?search=...
          navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
          setShowMobileMenu(false); // Đóng menu mobile nếu đang mở
          setSearchTerm(""); // (Tuỳ chọn) Xóa ô tìm kiếm sau khi enter
      }
  };
  // --------------------------

  return (
    <>
      <Navbar expand="lg" className="sticky-top py-3" style={{ zIndex: 1020, backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Container>
          {/* ... (Phần Logo giữ nguyên) ... */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center gap-2 me-lg-5">
            <div className="bg-success bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center">
               <FaLeaf className="text-success" />
            </div>
            <span className="text-success">EcoStore</span>
          </Navbar.Brand>

          {/* ... (Nút Mobile & Cart Mobile giữ nguyên) ... */}
          <Button 
            variant="link" 
            className="d-lg-none text-success border-0 fs-2 p-0 ms-auto me-3"
            onClick={() => setShowMobileMenu(true)}
          >
            <FaBars />
          </Button>

          <div className="d-flex align-items-center gap-2 d-lg-none">
             <Link to="/cart" className="position-relative text-success">
                <FaShoppingCart size={18} />
                {isLoggedIn && cartCount > 0 && (
                  <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-2 border-white">
                      {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}              
             </Link>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex">
            {/* --- SEARCH BAR (DESKTOP) --- */}
            <div className="mx-auto w-100 px-lg-5" style={{ maxWidth: '600px' }}>
                <Form className="d-flex position-relative w-100" onSubmit={handleSearch}>
                    <Form.Control
                        type="search"
                        placeholder="Tìm kiếm sản phẩm xanh..."
                        className="rounded-pill border-0 bg-light py-2 ps-4 pe-5 shadow-sm"
                        style={{ fontSize: '0.95rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="link" className="position-absolute top-50 end-0 translate-middle-y text-success pe-3">
                        <FaSearch />
                    </Button>
                </Form>
            </div>

            {/* ... (Phần Menu Links & User Actions giữ nguyên) ... */}
            <div className="d-flex align-items-center gap-4">
                <Nav className="d-flex gap-3 fw-medium">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Sản phẩm</NavLink>
                    <NavLink to="/offers" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Ưu đãi</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold border-bottom border-2 border-success pb-1" : "text-dark text-decoration-none hover-green pb-1"}>Giới thiệu</NavLink>
                </Nav>
                
                <div className="vr text-secondary opacity-25" style={{height: '25px'}}></div>

                <div className="d-flex align-items-center gap-3">
                    <Link to="/cart" className="position-relative btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center text-success cart-icon-hover" style={{width: 42, height: 42}}>
                        <FaShoppingCart size={18} />                        
                        {isLoggedIn && cartCount > 0 && (
                            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-2 border-white">
                                {cartCount > 99 ? '99+' : cartCount}
                            </Badge>
                        )}
                    </Link>

                    {/* User Dropdown giữ nguyên */}
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="transparent" className="p-0 border-0 after-none">
                            <div className="btn btn-light rounded-circle d-flex align-items-center justify-content-center shadow-sm user-icon-hover border border-success overflow-hidden" style={{width: 42, height: 42, padding: 0}}>
                                {isLoggedIn && userAvatar ? (
                                    <img src={userAvatar} alt="User" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                                ) : (
                                    <FaUserCircle size={24} className="text-success"/> 
                                )}
                            </div>
                        </Dropdown.Toggle>
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
                                        <Button as={Link} to="/login" variant="success" className="rounded-pill fw-bold btn-sm shadow-sm"><FaSignInAlt className="me-2"/> Đăng nhập</Button>
                                        <Button as={Link} to="/register" variant="outline-success" className="rounded-pill fw-bold btn-sm"><FaUserPlus className="me-2"/> Đăng ký</Button>
                                    </div>
                                </>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* MOBILE MENU (ĐÃ THÊM LOGIC SEARCH) */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end" className="border-0 rounded-start-4">
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title className="fw-bold text-success d-flex align-items-center gap-2">
             <FaLeaf /> EcoStore
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="d-flex flex-column px-4">
            <Form className="mb-4 mt-2" onSubmit={handleSearch}>
                <Form.Control 
                    type="search" 
                    placeholder="Tìm kiếm..." 
                    className="rounded-pill bg-light border-0 py-2" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Form>

            {/* ... (Các phần còn lại của mobile menu giữ nguyên) ... */}
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
                        <Button variant="danger" className="justify-content-center d-flex align-items-center gap-2 py-2 rounded-pill" onClick={() => { logout(); setShowMobileMenu(false); }}>
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