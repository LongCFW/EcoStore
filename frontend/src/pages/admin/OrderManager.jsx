import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaShoppingBag, FaCheckCircle, FaTruck, FaClock, FaTimesCircle, FaSyncAlt, FaCreditCard } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import orderApi from '../../services/order.service';
import '../../assets/styles/admin.css';

// Component Highlight Text giống StaffManager
const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.toString().split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <>{parts.map((part, index) => part.toLowerCase() === highlight.toLowerCase() ? <mark key={index} className="bg-warning text-dark px-1 rounded p-0">{part}</mark> : <span key={index}>{part}</span>)}</>
  );
};

const OrderManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // STATE TỪ URL PARAMETERS
  const searchTerm = searchParams.get('search') || '';
  const filterStatus = searchParams.get('status') || 'All';
  const filterPayment = searchParams.get('payment') || 'All'; // Lọc hình thức thanh toán
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, shipping: 0, completed: 0, cancelled: 0 });

  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const itemsPerPage = 7; 

  // Hàm cập nhật URL Params (Tối ưu performance)
  const updateParams = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') newParams.set(key, value);
    else newParams.delete(key);
    
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  // Debounce Search
  useEffect(() => {
    const timer = setTimeout(() => { 
        if (searchInput !== searchTerm) updateParams("search", searchInput); 
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, updateParams]);

  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  // FETCH ALL DATA (Để thống kê luôn đúng, lọc ở phía Client)
  const fetchOrders = useCallback(async () => {
      setLoading(true);
      try {
          const res = await orderApi.getAllOrders({}); // Lấy tất cả
          if (res.success) {
              setOrders(res.data);
              const all = res.data;
              setStats({
                  total: all.length,
                  pending: all.filter(o => o.status === 'pending').length,
                  shipping: all.filter(o => o.status === 'shipping' || o.status === 'confirmed').length,
                  completed: all.filter(o => o.status === 'delivered' || o.status === 'completed').length,
                  cancelled: all.filter(o => o.status === 'cancelled').length,
              });
          }
      } catch (error) {
          console.error("Lỗi tải danh sách đơn hàng:", error);
          toast.error("Lỗi tải dữ liệu");
      } finally {
          setLoading(false);
      }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleView = (order) => {
      setSelectedOrder(order);
      setShowModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
      try {
          const res = await orderApi.updateOrderStatus(id, newStatus);
          if (res.success) {
              toast.success("Cập nhật trạng thái thành công!");
              setOrders(prevOrders => prevOrders.map(o => o._id === id ? { ...o, status: newStatus } : o));
              fetchOrders(); // Refresh to update stats
          }
      } catch {
          toast.error("Cập nhật thất bại");
      }
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'delivered': case 'completed': return <Badge bg="success" className="rounded-pill px-3 bg-opacity-75">Hoàn thành</Badge>;
          case 'shipping': case 'confirmed': return <Badge bg="primary" className="rounded-pill px-3 bg-opacity-75">Vận chuyển</Badge>;
          case 'pending': return <Badge bg="warning" text="dark" className="rounded-pill px-3 bg-opacity-75">Chờ xử lý</Badge>;
          case 'cancelled': return <Badge bg="secondary" className="rounded-pill px-3 bg-opacity-75">Đã hủy</Badge>;
          default: return <Badge bg="light" text="dark">Mới</Badge>;
      }
  };

  // --- CLIENT-SIDE FILTERING ---
  const filteredOrders = orders.filter(order => {
    const s = searchTerm.toLowerCase();    
    const matchSearch = (order.orderNumber || "").toLowerCase().includes(s) || 
                        (order.userId?.name || "").toLowerCase().includes(s) ||
                        (order.phoneNumber || "").toLowerCase().includes(s);
    
    const matchStatus = filterStatus === 'All' || order.status === filterStatus;
    const matchPayment = filterPayment === 'All' || (order.paymentMethod || '').toLowerCase() === filterPayment.toLowerCase();

    return matchSearch && matchStatus && matchPayment;
  });

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="animate-fade-in">
      
      {/* 1. HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Đơn Hàng</h2>
            <p className="text-muted small m-0 mt-1">Theo dõi và xử lý đơn hàng của khách hàng</p>
        </div>
      </div>

      {/* 2. STATS CARDS (ĐỒNG BỘ GIAO DIỆN) */}
      <Row className="mb-4 g-3 row-cols-2 row-cols-md-5">
        <Col>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-scale-slight">
             <div className="bg-dark bg-opacity-10 text-dark rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '50px', height: '50px'}}><FaShoppingBag size={20}/></div>
             <div>
                <h4 className="fw-bold m-0 text-dark">{stats.total}</h4>
                <span className="text-muted small">Tổng Đơn</span>
             </div>
          </div>
        </Col>
        <Col>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-scale-slight">
             <div className="bg-warning bg-opacity-25 text-warning rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '50px', height: '50px'}}><FaClock size={20}/></div>
             <div>
                <h4 className="fw-bold m-0 text-dark">{stats.pending}</h4>
                <span className="text-muted small">Chờ Xử Lý</span>
             </div>
          </div>
        </Col>
        <Col>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-scale-slight">
             <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '50px', height: '50px'}}><FaTruck size={20}/></div>
             <div>
                <h4 className="fw-bold m-0 text-dark">{stats.shipping}</h4>
                <span className="text-muted small">Đang Giao</span>
             </div>
          </div>
        </Col>
        <Col>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-scale-slight">
             <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '50px', height: '50px'}}><FaCheckCircle size={20}/></div>
             <div>
                <h4 className="fw-bold m-0 text-dark">{stats.completed}</h4>
                <span className="text-muted small">Hoàn Thành</span>
             </div>
          </div>
        </Col>
        <Col>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3 h-100 hover-scale-slight">
             <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '50px', height: '50px'}}><FaTimesCircle size={20}/></div>
             <div>
                <h4 className="fw-bold m-0 text-dark">{stats.cancelled}</h4>
                <span className="text-muted small">Đã Hủy</span>
             </div>
          </div>
        </Col>
      </Row>

      {/* 3. BỘ LỌC CÙNG HÀNG VỚI RESET */}
      <div className="table-card p-3 mb-4 bg-white border rounded shadow-sm">          
          <Row className="g-3 align-items-center">
              <Col xs={12} md={4}>
                  <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>                      
                      <Form.Control 
                        type="text" placeholder="Tìm mã đơn, tên khách, SĐT..." 
                        className="border-start-0 shadow-none bg-light"
                        value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
                      />
                  </InputGroup>
              </Col>
              
              <Col xs={12} md={3}>                  
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0"><FaFilter className="text-muted" size={14}/></InputGroup.Text>
                    <Form.Select className="border-start-0 shadow-none bg-light" value={filterStatus} onChange={(e) => updateParams("status", e.target.value)}>
                        <option value="All">-- Tất cả trạng thái --</option>
                        <option value="pending">Chờ xử lý</option>
                        <option value="shipping">Đang vận chuyển</option>
                        <option value="delivered">Hoàn thành</option>
                        <option value="cancelled">Đã hủy</option>
                    </Form.Select>
                  </InputGroup>
              </Col>

              {/* Lọc hình thức thanh toán */}
              <Col xs={12} md={3}>                  
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0"><FaCreditCard className="text-muted" size={14}/></InputGroup.Text>
                    <Form.Select className="border-start-0 shadow-none bg-light" value={filterPayment} onChange={(e) => updateParams("payment", e.target.value)}>
                        <option value="All">-- Hình thức TT --</option>
                        <option value="cod">Thanh toán COD</option>
                        <option value="banking">Chuyển khoản (VietQR)</option>
                    </Form.Select>
                  </InputGroup>
              </Col>

              <Col xs={12} md={2}>
                  <Button variant="light" onClick={handleResetFilters} className="w-100 fw-bold d-flex align-items-center justify-content-center gap-2 border shadow-sm text-secondary hover-scale">
                      <FaSyncAlt /> Làm mới
                  </Button>
              </Col>
          </Row>
      </div>

      {/* 4. ORDERS TABLE (CÓ SCROLLBAR) */}
      <div className="table-card border rounded shadow-sm bg-white" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <tr>
                      <th className="ps-4 py-3">Mã Đơn</th>
                      <th className="py-3">Khách Hàng</th>
                      <th className="py-3 text-center">Ngày Đặt</th>
                      <th className="py-3 text-center">Tổng Tiền</th>
                      <th className="py-3 text-center">Thanh Toán</th>
                      <th className="py-3 text-center">Trạng Thái</th>
                      <th className="text-end pe-4 py-3">Chi Tiết</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan={7} className="text-center py-5 border-bottom-0"><Spinner animation="border" variant="success"/></td></tr>
                  ) : currentItems.length > 0 ? (
                      currentItems.map((order) => (
                        <tr key={order._id}>
                            <td className="ps-4 fw-bold text-success">
                                <HighlightText text={order.orderNumber} highlight={searchTerm} />
                            </td>
                            <td>
                                <div className="fw-bold" style={{color: 'var(--admin-text)'}}>
                                    <HighlightText text={order.userId?.name || "Khách Vãng Lai"} highlight={searchTerm} />
                                </div>
                                <small className="text-muted">
                                    <HighlightText text={order.phoneNumber} highlight={searchTerm} />
                                </small>
                            </td>
                            <td className="text-center">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                            <td className="fw-bold text-center text-dark">{order.totalAmount_cents?.toLocaleString()} đ</td>
                            <td className="text-center">
                                <Badge bg="light" text="dark" className="border text-uppercase shadow-sm">
                                    {order.paymentMethod === 'banking' ? 'VietQR' : order.paymentMethod}
                                </Badge>
                            </td>
                            <td className="text-center">{getStatusBadge(order.status)}</td>
                            <td className="text-end pe-4">
                                <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-primary hover-scale px-3" onClick={() => handleView(order)}>
                                    <FaEye className="me-1"/> Xem
                                </Button>
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={7} className="border-bottom-0 p-0">
                              <div className="d-flex flex-column align-items-center justify-content-center w-100" style={{ minHeight: '200px' }}>
                                  <FaShoppingBag size={40} className="mb-3 text-muted opacity-50"/>
                                  <h6 className="text-muted mb-0">Không tìm thấy đơn hàng nào phù hợp.</h6>
                              </div>
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
      </div>
      
      {/* 5. PAGINATION */}
      {totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column bg-white rounded-bottom shadow-sm mt-2">
              <Pagination className="eco-pagination mb-2">
                  <Pagination.Prev onClick={() => updateParams("page", currentPage - 1)} disabled={currentPage === 1} />
                  {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => updateParams("page", idx + 1)}>
                          {idx + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => updateParams("page", currentPage + 1)} disabled={currentPage === totalPages} />
              </Pagination>
              <small className="text-muted">
                  Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
              </small>
          </div>
      )}

      {/* MODAL CHI TIẾT */}
      <OrderDetailModal 
        key={selectedOrder ? selectedOrder._id : 'closed'}
        show={showModal}
        handleClose={() => setShowModal(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManager;