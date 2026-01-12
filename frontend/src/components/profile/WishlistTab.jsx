import React, { useState } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { FaTrash, FaShoppingCart, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const WishlistTab = () => {
  const [wishlist, setWishlist] = useState([
    { id: 1, name: "Bàn chải tre Eco", price: 45000, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb6dc2d?auto=format&fit=crop&w=150", stock: true },
    { id: 4, name: "Xà phòng thảo mộc", price: 80000, image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=150", stock: false },
  ]);

  const handleRemove = (id) => {
      setWishlist(wishlist.filter(item => item.id !== id));
  };

  const handleAddToCart = (item) => {
      alert(`Đã thêm "${item.name}" vào giỏ hàng!`);
  };

  return (
    <div className="profile-content-card animate-fade-in">
      <h4 className="fw-bold mb-4 pb-3 border-bottom text-danger"><FaHeart className="me-2"/>Sản phẩm yêu thích</h4>
      {wishlist.length > 0 ? (
        wishlist.map(item => (
            <div key={item.id} className="d-flex align-items-center border-bottom py-3 hover-bg-light transition-all rounded px-2">
                <img src={item.image} alt={item.name} className="rounded border" style={{width: '80px', height: '80px', objectFit:'cover'}} />
                <div className="ms-3 flex-grow-1">
                    <Link to={`/product/${item.id}`} className="fw-bold text-dark text-decoration-none hover-green">{item.name}</Link>
                    <div className="text-success fw-bold">{item.price.toLocaleString()} đ</div>
                    <div className={`small ${item.stock ? 'text-primary' : 'text-danger'}`}>
                        {item.stock ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                </div>
                <div className="d-flex flex-column gap-2">
                      <Button variant="success" size="sm" className="rounded-pill px-3" disabled={!item.stock} onClick={() => handleAddToCart(item)}>
                        <FaShoppingCart className="me-1"/> Thêm
                      </Button>
                      <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => handleRemove(item.id)}>
                        <FaTrash className="me-1"/> Xóa
                      </Button>
                </div>
            </div>
        ))
      ) : (
          <p className="text-muted text-center py-5">Danh sách yêu thích trống.</p>
      )}
    </div>
  );
};

export default WishlistTab;