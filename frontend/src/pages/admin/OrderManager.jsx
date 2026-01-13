import React, { useState } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaDownload, FaShoppingBag, FaCheckCircle, FaTruck, FaClock } from 'react-icons/fa';
import OrderDetailModal from '../../components/admin/OrderDetailModal';
import '../../assets/styles/admin.css';

const OrderManager = () => {
  // 1. GENERATE MOCK DATA (25 ĐƠN HÀNG)
  // Dùng callback trong useState để chỉ chạy 1 lần
  const [orders, setOrders] = useState(() => {
      const data = [];
      const customers = ["Nguyễn Văn A", "Trần Thị B", "Lê Văn C", "Phạm Thị D", "Hoàng Văn E"];
      const statuses = ["pending", "shipping", "completed", "cancelled"];
      
      for (let i = 1; i <= 25; i++) {
          const status = statuses[i % 4];
          data.push({
              id: `ORD-${1000 + i}`,
              date: `20/01/2025`,
              customer: customers[i % 5],
              phone: `09012345${i < 10 ? '0' + i : i}`,
              email: `customer${i}@ecostore.com`,
              address: `Số ${i}, Đường ABC, TP.HCM`,
              paymentMethod: i % 2 === 0 ? 'Banking' : 'COD',
              status: status,
              statusLabel: status === 'pending' ? 'Chờ xử lý' : status === 'shipping' ? 'Đang giao' : status === 'completed' ? 'Hoàn thành' : 'Đã hủy',
              items: [{name: 'Sản phẩm mẫu', quantity: 1, price: 100000}],
              subtotal: 100000,
              shippingFee: 30000,
              total: 130000 + (i * 10000) // Giá trị khác nhau chút
          });
      }
      return data;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC ---
  const handleView = (order) => {
      setSelectedOrder(order);
      setShowModal(true);
  };

  const handleUpdateStatus = (id, newStatus) => {
      const statusLabels = {
          'pending': 'Chờ xử lý',
          'shipping': 'Đang giao',
          'completed': 'Hoàn thành',
          'cancelled': 'Đã hủy'
      };
      
      setOrders(orders.map(o => 
          o.id === id ? { ...o, status: newStatus, statusLabel: statusLabels[newStatus] } : o
      ));
  };

  const getStatusBadge = (status) => {
      switch(status) {
          case 'completed': return <Badge bg="success" className="rounded-pill px-3 bg-opacity-75">Hoàn thành</Badge>;
          case 'shipping': return <Badge bg="primary" className="rounded-pill px-3 bg-opacity-75">Vận chuyển</Badge>;
          case 'pending': return <Badge bg="warning" text="dark" className="rounded-pill px-3 bg-opacity-75">Chờ xử lý</Badge>;
          case 'cancelled': return <Badge bg="secondary" className="rounded-pill px-3 bg-opacity-75">Đã hủy</Badge>;
          default: return <Badge bg="light" text="dark">Mới</Badge>;
      }
  };

  // --- FILTER & PAGINATION LOGIC ---
  const filteredOrders = orders.filter(order => {
      const matchSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = filterStatus === 'All' || order.status === filterStatus;
      return matchSearch && matchStatus;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
      setFilterStatus(e.target.value);
      setCurrentPage(1);
  };

  // Mini Stats Calculation
  const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      shipping: orders.filter(o => o.status === 'shipping').length,
      completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="animate-fade-in">
      {/* 1. HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Đơn Hàng</h2>
            <p className="text-muted small m-0">Theo dõi và xử lý đơn hàng của khách</p>
        </div>
        <Button variant="outline-success" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
            <FaDownload /> Xuất Excel
        </Button>
      </div>

      {/* 2. MINI STATS BAR */}
      <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
              <div className="stat-card p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-light p-3 text-primary"><FaShoppingBag size={20}/></div>
                  <div>
                      <h4 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>{stats.total}</h4>
                      <small className="text-muted">Tổng đơn</small>
                  </div>
              </div>
          </Col>
          <Col xs={6} md={3}>
              <div className="stat-card p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-warning bg-opacity-25 p-3 text-warning"><FaClock size={20}/></div>
                  <div>
                      <h4 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>{stats.pending}</h4>
                      <small className="text-muted">Chờ xử lý</small>
                  </div>
              </div>
          </Col>
          <Col xs={6} md={3}>
              <div className="stat-card p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-primary bg-opacity-25 p-3 text-primary"><FaTruck size={20}/></div>
                  <div>
                      <h4 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>{stats.shipping}</h4>
                      <small className="text-muted">Đang giao</small>
                  </div>
              </div>
          </Col>
          <Col xs={6} md={3}>
              <div className="stat-card p-3 d-flex align-items-center gap-3">
                  <div className="rounded-circle bg-success bg-opacity-25 p-3 text-success"><FaCheckCircle size={20}/></div>
                  <div>
                      <h4 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>{stats.completed}</h4>
                      <small className="text-muted">Hoàn thành</small>
                  </div>
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
                        placeholder="Tìm mã đơn, tên khách..." 
                        className="border-start-0 shadow-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>
                  <Form.Select 
                    className="shadow-none" 
                    value={filterStatus}
                    onChange={handleFilterChange}
                  >
                      <option value="All">Tất cả trạng thái</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="shipping">Đang vận chuyển</option>
                      <option value="completed">Hoàn thành</option>
                      <option value="cancelled">Đã hủy</option>
                  </Form.Select>
              </Col>
              <Col md={2}>
                  <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                      <FaFilter /> Lọc nâng cao
                  </Button>
              </Col>
          </Row>
      </div>

      {/* 4. ORDERS TABLE */}
      <div className="table-card overflow-hidden">
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
                        <tr key={order.id}>
                            <td className="ps-4 fw-bold text-success">{order.id}</td>
                            <td>
                                <div className="fw-bold" style={{color: 'var(--admin-text)'}}>{order.customer}</div>
                                <small className="text-muted">{order.phone}</small>
                            </td>
                            <td>{order.date}</td>
                            <td className="fw-bold">{order.total.toLocaleString()} đ</td>
                            <td><Badge bg="light" text="dark" className="border">{order.paymentMethod}</Badge></td>
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
          
          {/* 5. PAGINATION (DÙNG CHUNG STYLE) */}
          {totalPages > 1 && (
              <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column">
                  <Pagination className="eco-pagination mb-2">
                      <Pagination.Prev 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 1}
                      />
                      {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item 
                            key={idx + 1} 
                            active={idx + 1 === currentPage}
                            onClick={() => handlePageChange(idx + 1)}
                          >
                              {idx + 1}
                          </Pagination.Item>
                      ))}
                      <Pagination.Next 
                        onClick={() => handlePageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages}
                      />
                  </Pagination>
                  
                  <small className="text-muted">
                      Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredOrders.length)} trên tổng số {filteredOrders.length} đơn hàng
                  </small>
              </div>
          )}
      </div>

      {/* MODAL CHI TIẾT */}
      <OrderDetailModal 
        key={selectedOrder ? selectedOrder.id : 'closed'}
        show={showModal}
        handleClose={() => setShowModal(false)}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
};

export default OrderManager;