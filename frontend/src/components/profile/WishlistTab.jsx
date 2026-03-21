import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { FaTrash, FaHeart, FaBoxOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import AddToCartBtn from '../cart/AddToCartBtn';

const WishlistTab = () => {
  const { wishlist, toggleWishlist } = useWishlist();

  return (
    <div className="profile-content-card animate-fade-in">
      <h4 className="fw-bold mb-4 pb-3 border-bottom text-danger d-flex align-items-center gap-2">
          <FaHeart /> Sản phẩm yêu thích ({wishlist.length})
      </h4>
      
      <div className="custom-scrollbar" style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
          {wishlist.length > 0 ? (
            wishlist.map(item => {            
                const image = item.images?.[0]?.imageUrl || 'https://placehold.co/100';
                const price = item.price_cents || 0;            
                const isStock = (item.variants?.[0]?.stock || item.stock || 0) > 0;

                return (
                    <div key={item._id} className="p-3 mb-3 bg-white rounded-4 border shadow-sm transition-all hover-scale-slight">
                        <Row className="align-items-center">
                            <Col xs={3} sm={2} md={2} className="text-center">
                                <img src={image} alt={item.name} className="img-fluid rounded border object-fit-cover shadow-sm" style={{width: '80px', height: '80px'}} />
                            </Col>
                            
                            <Col xs={9} sm={6} md={6}>
                                <div className="d-flex flex-column h-100 justify-content-center">
                                    <Link to={`/product/${item.slug}`} className="fw-bold text-dark text-decoration-none hover-green fs-5 mb-1 text-truncate-2-lines">
                                        {item.name}
                                    </Link>
                                    <div className="d-flex align-items-center gap-3 mt-1">
                                        <span className="text-success fw-bold fs-6">{price.toLocaleString()} đ</span>
                                        <div className={`small fw-medium px-2 py-1 rounded ${isStock ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'}`}>
                                            {isStock ? 'Còn hàng' : 'Hết hàng'}
                                        </div>
                                    </div>
                                </div>
                            </Col>

                            <Col xs={12} sm={4} md={4} className="d-flex align-items-center justify-content-sm-end gap-3 mt-3 mt-sm-0 pt-3 pt-sm-0 border-top border-sm-0">
                                  {/* Đã tháo icon FaShoppingCart dư thừa bên trong */}
                                  <AddToCartBtn 
                                    productId={item._id}
                                    className="rounded-pill px-4 fw-bold shadow-sm"
                                    disabled={!isStock}
                                  >
                                    Thêm vào giỏ
                                  </AddToCartBtn>
                                  
                                  {/* Sửa lại nút Xóa thành dạng text tinh tế hơn */}
                                  <Button variant="link" className="text-decoration-none text-danger p-0 d-flex align-items-center gap-1 hover-scale" title="Xóa khỏi danh sách" onClick={() => toggleWishlist(item)}>
                                    <FaTrash size={16}/>
                                  </Button>
                            </Col>
                        </Row>
                    </div>
                );
            })
          ) : (
              <div className="text-center py-5 text-muted bg-light rounded-4 border border-dashed">
                  <FaBoxOpen size={50} className="mb-3 text-danger opacity-50"/>
                  <p className="fs-5 fw-medium">Danh sách yêu thích đang trống.</p>
                  <p className="text-secondary small mb-4">Hãy lướt quanh cửa hàng và thả tim cho những sản phẩm bạn thích nhé!</p>
                  <Link to="/products" className="btn btn-outline-danger rounded-pill px-5 fw-bold shadow-sm">Khám phá ngay</Link>
              </div>
          )}
      </div>
    </div>
  );
};

export default WishlistTab;