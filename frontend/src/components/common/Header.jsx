import React, { useState, useEffect, useMemo } from "react";
import { Navbar, Container, Nav, Form, Button, Badge, Dropdown, Offcanvas } from "react-bootstrap";
import { FaShoppingCart, FaUserCircle, FaSearch, FaLeaf, FaBars, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaBoxOpen, FaHeart, FaChevronRight, FaBars as FaMenu } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import categoryApi from '../../services/category.service';

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { user, logout } = useAuth(); 
  const { cartCount } = useCart();    
  const isLoggedIn = !!user; 
  const userAvatar = user?.avatarUrl; 
  const userName = user?.name || "User";

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  // STATE DANH MỤC
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
        try {
            const res = await categoryApi.getAll({ limit: 1000, is_active: true });
            let catList = [];
            if (Array.isArray(res)) catList = res;
            else if (res?.categories && Array.isArray(res.categories)) catList = res.categories;
            else if (res?.data && Array.isArray(res.data.categories)) catList = res.data.categories;
            else if (res?.data && Array.isArray(res.data)) catList = res.data;
            
            setCategories(catList || []);
        } catch (error) {
            console.error("Không tải được danh mục lên Header", error);
            setCategories([]);
        }
    };
    fetchCats();
  }, []);

  const categoryTree = useMemo(() => {
      if (!Array.isArray(categories)) return [];
      const validCats = categories.filter(c => c != null);
      const roots = validCats.filter(c => !c.parentId);
      
      return roots.map(root => ({
          ...root,
          children: validCats.filter(c => {
              if (!c.parentId) return false;
              const pId = typeof c.parentId === 'object' ? c.parentId._id : c.parentId;
              return pId === root._id;
          })
      }));
  }, [categories]);

  const handleSearch = (e) => {
      e.preventDefault(); 
      if (searchTerm.trim()) {
          navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
          setShowMobileMenu(false); 
          setSearchTerm(""); 
      }
  };

  return (
    <>
      <Navbar expand="lg" className="sticky-top py-3" style={{ zIndex: 1020, backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <Container>
          
          {/* 1. LOGO */}
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 d-flex align-items-center gap-2 me-3 me-lg-4">
            <div className="bg-success bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center">
               <FaLeaf className="text-success" />
            </div>
            <span className="text-success">EcoStore</span>
          </Navbar.Brand>

          {/* NÚT MOBILE (Giữ nguyên) */}
          <Button variant="link" className="d-lg-none text-success border-0 fs-2 p-0 ms-auto me-3" onClick={() => setShowMobileMenu(true)}>
            <FaBars />
          </Button>
          <div className="d-flex align-items-center gap-2 d-lg-none">
             <Link to="/cart" className="position-relative text-success">
                <FaShoppingCart size={18} />
                {isLoggedIn && cartCount > 0 && <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-2 border-white">{cartCount > 99 ? '99+' : cartCount}</Badge>}              
             </Link>
          </div>

          <Navbar.Collapse id="basic-navbar-nav" className="d-none d-lg-flex align-items-center w-100">
            
            {/* 2. NÚT DANH MỤC MEGA MENU (Y HỆT HÌNH 1) */}
            <div className="nav-item dropdown custom-nav-dropdown me-3">
                {/* Nút Xanh lá */}
                <Button 
                    as={Link} 
                    to="/products" 
                    variant="success" 
                    className="rounded-pill px-4 py-2 fw-bold d-flex align-items-center gap-2"
                    style={{ background: '#20c997', border: 'none', boxShadow: '0 4px 10px rgba(32,201,151,0.3)' }}
                >
                    <FaMenu size={16}/> Danh Mục
                </Button>
                
                {/* Bảng Dropdown Menu (Thả xuống dưới nút) */}
                <div className="custom-dropdown-menu shadow rounded-4 border-0 py-2 mt-2" style={{ minWidth: '240px' }}>
                    {categoryTree && categoryTree.length > 0 ? (
                        categoryTree.map(root => (
                            <div key={root._id} className="custom-dropdown-item-wrapper">
                                <Link 
                                    to={`/products?category=${root._id}`} 
                                    className="custom-dropdown-item d-flex justify-content-between align-items-center py-2 px-3"
                                >
                                    {root.name}
                                    {root.children && root.children.length > 0 && <FaChevronRight size={12} className="text-muted"/>}
                                </Link>

                                {/* Sub-menu */}
                                {root.children && Array.isArray(root.children) && root.children.length > 0 && (
                                    <div className="custom-submenu shadow rounded-4 border-0 py-2">
                                        {root.children.map(sub => (
                                            <Link 
                                                key={sub._id} 
                                                to={`/products?category=${sub._id}`} 
                                                className="custom-submenu-item py-2 px-3"
                                            >
                                                {sub.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-muted small">Đang tải danh mục...</div>
                    )}
                </div>
            </div>

            {/* 3. SEARCH BAR */}
            <div className="flex-grow-1 me-lg-4" style={{ maxWidth: '500px' }}>
                <Form className="d-flex position-relative w-100" onSubmit={handleSearch}>
                    <Form.Control
                        type="search"
                        placeholder="Tìm kiếm sản phẩm xanh..."
                        className="rounded-pill border border-success border-opacity-25 bg-white py-2 ps-4 pe-5 shadow-sm"
                        style={{ fontSize: '0.95rem' }}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button type="submit" variant="link" className="position-absolute top-50 end-0 translate-middle-y text-success pe-3">
                        <FaSearch />
                    </Button>
                </Form>
            </div>

            {/* 4. LINKS & USER MENU */}
            <div className="d-flex align-items-center gap-3 ms-auto">
                <Nav className="d-flex gap-3 fw-medium align-items-center me-2">
                    <NavLink to="/" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold" : "text-dark text-decoration-none hover-green"}>Trang chủ</NavLink>
                    <NavLink to="/products" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold" : "text-dark text-decoration-none hover-green"}>Sản phẩm</NavLink>
                    <NavLink to="/offers" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold" : "text-dark text-decoration-none hover-green"}>Ưu đãi</NavLink>
                    <NavLink to="/about" className={({isActive}) => isActive ? "text-success text-decoration-none fw-bold" : "text-dark text-decoration-none hover-green"}>Giới thiệu</NavLink>
                </Nav>
                
                <div className="vr text-secondary opacity-25" style={{height: '25px'}}></div>

                <div className="d-flex align-items-center gap-2">
                    <Link to="/cart" className="position-relative btn btn-light rounded-circle shadow-sm d-flex align-items-center justify-content-center text-success cart-icon-hover" style={{width: 42, height: 42}}>
                        <FaShoppingCart size={18} />                        
                        {isLoggedIn && cartCount > 0 && (
                            <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle border border-2 border-white">
                                {cartCount > 99 ? '99+' : cartCount}
                            </Badge>
                        )}
                    </Link>

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

      {/* MOBILE MENU */}
      <Offcanvas show={showMobileMenu} onHide={() => setShowMobileMenu(false)} placement="end" className="border-0 rounded-start-4">
        {/* ... (Phần mobile menu giữ nguyên) ... */}
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