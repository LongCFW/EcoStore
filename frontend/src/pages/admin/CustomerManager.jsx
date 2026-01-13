import React, { useState } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaUnlock, FaLock, FaDownload, FaUsers } from 'react-icons/fa';
import CustomerDetailModal from '../../components/admin/CustomerDetailModal';
import '../../assets/styles/admin.css';

const CustomerManager = () => {
  // 1. KHỞI TẠO DATA TRỰC TIẾP (KHÔNG DÙNG USEEFFECT, KHÔNG DÙNG MATH.RANDOM)
  // Dùng hàm callback trong useState để chỉ chạy 1 lần khi load trang
  const [customers, setCustomers] = useState(() => {
      const data = [];
      const firstNames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng"];
      const lastNames = ["Văn A", "Thị B", "Văn C", "Thị D", "Minh E", "Ngọc F", "Quang G", "Thu H"];
      
      for (let i = 1; i <= 25; i++) {
          // Dùng toán tử % để lấy dữ liệu xoay vòng -> Luôn cố định, không bao giờ lỗi impure
          const firstName = firstNames[i % firstNames.length];
          const lastName = lastNames[i % lastNames.length];
          const roleType = i % 3 === 0 ? 'Thành viên Vàng' : 'Thành viên Bạc';
          const statusType = i % 5 === 0 ? 'Locked' : 'Active';
          
          data.push({
              id: `CUS-${1000 + i}`,
              name: `${firstName} ${lastName}`,
              email: `customer${i}@ecostore.com`,
              phone: `090${1000000 + i}`, // Số điện thoại giả định tăng dần
              avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
              address: `Số ${i}, Đường Nguyễn Huệ, TP.HCM`,
              joinDate: '20/01/2024',
              status: statusType,
              totalOrders: (i * 2) + 5,
              totalSpent: ((i * 0.5) + 1).toFixed(1),
              role: roleType
          });
      }
      return data;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- LOGIC HÀNH ĐỘNG ---
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
  };

  const handleToggleStatus = (id, newStatus) => {
    if(window.confirm(`Xác nhận ${newStatus === 'Locked' ? 'KHÓA' : 'MỞ KHÓA'} tài khoản này?`)) {
        setCustomers(customers.map(c => c.id === id ? { ...c, status: newStatus } : c));
        if (selectedCustomer && selectedCustomer.id === id) {
            setSelectedCustomer(prev => ({ ...prev, status: newStatus }));
        }
    }
  };

  // --- LOGIC LỌC & PHÂN TRANG ---
  const filteredCustomers = customers.filter(c => {
    const term = searchTerm.toLowerCase();
    const matchSearch = c.name.toLowerCase().includes(term) || 
                        c.email.toLowerCase().includes(term) ||
                        c.phone.includes(term);
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
      setFilterStatus(e.target.value);
      setCurrentPage(1);
  };

  return (
    <div className="animate-fade-in">
      {/* 1. HEADER & TOOLBAR */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Khách Hàng</h2>
            <p className="text-muted small m-0"><FaUsers className="me-1"/>Tổng số: {filteredCustomers.length} khách hàng</p>
        </div>
        <Button variant="outline-success" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
            <FaDownload /> Xuất danh sách
        </Button>
      </div>

      {/* 2. FILTER BAR */}
      <div className="table-card p-3 mb-4">
          <Row className="g-3">
              <Col md={5}>
                  <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, email hoặc SĐT..." 
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
                      <option value="Active">Đang hoạt động</option>
                      <option value="Locked">Bị khóa</option>
                  </Form.Select>
              </Col>
              <Col md={2}>
                  <Button variant="outline-secondary" className="w-100 d-flex align-items-center justify-content-center gap-2">
                      <FaFilter /> Lọc nhóm
                  </Button>
              </Col>
          </Row>
      </div>

      {/* 3. CUSTOMER TABLE */}
      <div className="table-card overflow-hidden">
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead>
                  <tr>
                      <th className="ps-4">Khách Hàng</th>
                      <th>Liên Hệ</th>
                      <th>Ngày Tham Gia</th>
                      <th className="text-center">Đơn Hàng</th>
                      <th>Trạng Thái</th>
                      <th className="text-end pe-4">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {currentItems.length > 0 ? (
                      currentItems.map((cust) => (
                        <tr key={cust.id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img 
                                        src={cust.avatar} 
                                        alt={cust.name} 
                                        className="rounded-circle border object-fit-cover" 
                                        style={{width: 45, height: 45}}
                                    />
                                    <div>
                                        <div className="fw-bold" style={{color: 'var(--admin-text)'}}>{cust.name}</div>
                                        <small className="text-muted">{cust.id}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{cust.email}</div>
                                <small className="text-muted">{cust.phone}</small>
                            </td>
                            <td>{cust.joinDate}</td>
                            <td className="text-center fw-bold">{cust.totalOrders}</td>
                            <td>
                                {cust.status === 'Active' ? (
                                    <Badge bg="success" className="rounded-pill px-3 bg-opacity-75">Active</Badge>
                                ) : (
                                    <Badge bg="danger" className="rounded-pill px-3 bg-opacity-75">Locked</Badge>
                                )}
                            </td>
                            <td className="text-end pe-4">
                                <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-primary hover-scale me-2" onClick={() => handleViewCustomer(cust)}>
                                    <FaEye className="me-1"/> Xem
                                </Button>
                                {cust.status === 'Active' ? (
                                    <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-danger hover-scale" onClick={() => handleToggleStatus(cust.id, 'Locked')} title="Khóa">
                                        <FaLock/>
                                    </Button>
                                ) : (
                                    <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-success hover-scale" onClick={() => handleToggleStatus(cust.id, 'Active')} title="Mở khóa">
                                        <FaUnlock/>
                                    </Button>
                                )}
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan="6" className="text-center py-5 text-muted">
                              Không tìm thấy khách hàng nào phù hợp.
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
          
          {/* 4. PAGINATION */}
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
                      Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredCustomers.length)} trên tổng số {filteredCustomers.length} khách hàng
                  </small>
              </div>
          )}
      </div>

      {/* MODAL */}
      <CustomerDetailModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        customer={selectedCustomer}
        handleToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default CustomerManager;