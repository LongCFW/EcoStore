import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaTrash, FaShoppingCart } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const WishlistTab = () => {
  // Dữ liệu giả wishlist
  const wishlistItems = [
    { id: 1, name: "Bàn chải tre Eco", price: 45000, image: "https://via.placeholder.com/150", stock: true },
    { id: 4, name: "Xà phòng thảo mộc", price: 80000, image: "https://via.placeholder.com/150", stock: false },
  ];

  return (
    <Card className="border-0 shadow-sm p-4">
      <h4 className="fw-bold mb-4">Sản phẩm yêu thích</h4>
      {wishlistItems.length > 0 ? (
        wishlistItems.map(item => (
            <div key={item.id} className="d-flex align-items-center border-bottom py-3">
                <img src={item.image} alt={item.name} className="rounded" style={{width: '80px', height: '80px', objectFit:'cover'}} />
                <div className="ms-3 flex-grow-1">
                    <Link to={`/product/${item.id}`} className="fw-bold text-dark text-decoration-none">{item.name}</Link>
                    <div className="text-primary fw-bold">{item.price.toLocaleString()} đ</div>
                    <div className={`small ${item.stock ? 'text-success' : 'text-danger'}`}>
                        {item.stock ? 'Còn hàng' : 'Hết hàng'}
                    </div>
                </div>
                <div className="d-flex flex-column gap-2">
                     <Button variant="success" size="sm" disabled={!item.stock}>
                        <FaShoppingCart /> Thêm
                     </Button>
                     <Button variant="outline-danger" size="sm">
                        <FaTrash /> Xóa
                     </Button>
                </div>
            </div>
        ))
      ) : (
          <p className="text-muted">Danh sách yêu thích trống.</p>
      )}
    </Card>
  );
};

export default WishlistTab;