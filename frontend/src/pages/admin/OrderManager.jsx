import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload, FaShoppingBag, FaCheckCircle, FaTruck, FaClock, FaTimesCircle } from 'react-icons/fa';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import orderApi from '../../services/order.service';
import toast from 'react-hot-toast';
import '../../assets/styles/admin.css';

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Số lượng item mỗi trang

  // Stats State (Thống kê nhanh)
  const [stats, setStats] = useState({ total: 0, pending: 0, shipping: 0, completed: 0 });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- FETCH DATA ---
  const fetchOrders = useCallback(async () => {
      setLoading(true);
      try {
          // Gọi API (Backend đã có params status nhưng ở đây mình fetch hết về rồi filter client cho nhanh với số lượng ít,
          // hoặc truyền params nếu muốn server-side filtering chuẩn chỉ)
          const res = await orderApi.getAllOrders({ status: filterStatus === 'All' ? '' : filterStatus });
          if (res.success) {
              setOrders(res.data);
              
              // Tính toán stats từ dữ liệu mới nhất
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
  }, [filterStatus]); // Khi filterStatus thay đổi -> Gọi lại API

  useEffect(() => {
      fetchOrders();
  }, [fetchOrders]);

  // --- ACTIONS ---
  const handleView = (order) => {
      setSelectedOrder(order);
      setShowModal(true);
  };

  const handleUpdateStatus = async (id, newStatus) => {
      try {
          const res = await orderApi.updateOrderStatus(id, newStatus);
          if (res.success) {
              toast.success("Cập nhật trạng thái thành công!");
              
              // Cập nhật local state ngay lập tức để UI mượt
              setOrders(prevOrders => 
                  prevOrders.map(o => o._id === id ? { ...o, status: newStatus } : o)
              );
              // Cập nhật lại stats
              fetchOrders(); 
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

  // --- CLIENT-SIDE FILTERING (Cho Search) ---
  const filteredOrders = orders.filter(order => {
    const s = searchTerm.toLowerCase();    
    const orderNumber = (order.orderNumber || "").toLowerCase();
    const customerName = (order.userId?.name || "").toLowerCase();
    const phoneNumber = (order.phoneNumber || "").toLowerCase();

    return orderNumber.includes(s) || 
           customerName.includes(s) ||
           phoneNumber.includes(s);
});

  // --- PAGINATION ---
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="animate-fade-in">
      {/* 1. HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Đơn Hàng</h2>
            <p className="text-muted small m-0">Theo dõi và xử lý đơn hàng của khách</p>
        </div>
        <Button variant="outline-success" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2" onClick={fetchOrders}>
            <FaDownload /> Làm mới
        </Button>
      </div>

      {/* 2. MINI STATS BAR */}
      <Row className="g-3 mb-4 row-cols-2 row-cols-md-5"> 
        <Col>
            <div className="stat-card p-3 d-flex align-items-center gap-3 h-100">
                <div className="rounded-circle bg-light p-3 text-primary"><FaShoppingBag size={20}/></div>
                <div><h4 className="fw-bold m-0 text-dark">{stats.total}</h4><small className="text-muted">Tổng đơn</small></div>
            </div>
        </Col>
        <Col>
            <div className="stat-card p-3 d-flex align-items-center gap-3 h-100">
                <div className="rounded-circle bg-warning bg-opacity-25 p-3 text-warning"><FaClock size={20}/></div>
                <div><h4 className="fw-bold m-0 text-dark">{stats.pending}</h4><small className="text-muted">Chờ xử lý</small></div>
            </div>
        </Col>
        <Col>
            <div className="stat-card p-3 d-flex align-items-center gap-3 h-100">
                <div className="rounded-circle bg-primary bg-opacity-25 p-3 text-primary"><FaTruck size={20}/></div>
                <div><h4 className="fw-bold m-0 text-dark">{stats.shipping}</h4><small className="text-muted">Đang giao</small></div>
            </div>
        </Col>
        <Col>
            <div className="stat-card p-3 d-flex align-items-center gap-3 h-100">
                <div className="rounded-circle bg-success bg-opacity-25 p-3 text-success"><FaCheckCircle size={20}/></div>
                <div><h4 className="fw-bold m-0 text-dark">{stats.completed}</h4><small className="text-muted">Hoàn thành</small></div>
            </div>
        </Col>
                
        <Col>
            <div className="stat-card p-3 d-flex align-items-center gap-3 h-100">
                <div className="rounded-circle bg-danger bg-opacity-25 p-3 text-danger"><FaTimesCircle size={20}/></div>
                <div><h4 className="fw-bold m-0 text-dark">{stats.cancelled}</h4><small className="text-muted">Đã hủy</small></div>
            </div>
        </Col>
      </Row>

      {/* 3. FILTERS */}
      <div className="table-card p-3 mb-4">
          <Row className="g-3">
              <Col md={5}>
                  <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        placeholder="Tìm mã đơn, tên khách, SĐT..." 
                        className="border-start-0 shadow-none"
                        value={searchTerm}
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>
                  <Form.Select 
                    className="shadow-none" 
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  >
                      <option value="All">Tất cả trạng thái</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="shipping">Đang vận chuyển</option>
                      <option value="delivered">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                  </Form.Select>
              </Col>
              <Col md={2}>
                  <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                      <FaFilter /> Lọc
                  </Button>
              </Col>
          </Row>
      </div>

      {/* 4. ORDERS TABLE */}
      <div className="table-card overflow-hidden">
          {loading ? (
              <div className="text-center py-5"><Spinner animation="border" variant="primary"/></div>
          ) : (
              <Table hover responsive className="custom-table align-middle mb-0">
                  <thead>
                      <tr>
                          <th className="ps-4">Mã Đơn</th>
                          <th>Khách Hàng</th>
                          <th>Ngày Đặt</th>
                          <th>Tổng Tiền</th>
                          <th>Thanh Toán</th>
                          <th>Trạng Thái</th>
                          <th className="text-end pe-4">Chi Tiết</th>
                      </tr>
                  </thead>
                  <tbody>
                      {currentItems.length > 0 ? (
                          currentItems.map((order) => (
                            <tr key={order._id}>
                                <td className="ps-4 fw-bold text-success">{order.orderNumber}</td>
                                <td>
                                    <div className="fw-bold" style={{color: 'var(--admin-text)'}}>{order.userId?.name || "Guest"}</div>
                                    <small className="text-muted">{order.phoneNumber}</small>
                                </td>
                                <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                                <td className="fw-bold">{order.totalAmount_cents?.toLocaleString()} đ</td>
                                <td><Badge bg="light" text="dark" className="border text-uppercase">{order.paymentMethod}</Badge></td>
                                <td>{getStatusBadge(order.status)}</td>
                                <td className="text-end pe-4">
                                    <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-primary hover-scale px-3" onClick={() => handleView(order)}>
                                        <FaEye className="me-1"/> Xem
                                    </Button>
                                </td>
                            </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="7" className="text-center py-5 text-muted">
                                  Không tìm thấy đơn hàng nào phù hợp.
                              </td>
                          </tr>
                      )}
                  </tbody>
              </Table>
          )}
          
          {/* 5. PAGINATION */}
          {totalPages > 1 && (
              <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column">
                  <Pagination className="eco-pagination mb-2">
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                      {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => handlePageChange(idx + 1)}>
                              {idx + 1}
                          </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                  </Pagination>
                  <small className="text-muted">
                      Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
                  </small>
              </div>
          )}
      </div>

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