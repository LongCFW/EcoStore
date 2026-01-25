import React, { useState, useEffect, useCallback } from 'react'; // Import thêm useCallback
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaUnlock, FaLock, FaDownload, FaUsers } from 'react-icons/fa';
import CustomerDetailModal from '../../components/admin/CustomerDetailModal';
import axiosClient from '../../services/axiosClient';
import '../../assets/styles/admin.css';

const CustomerManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // State Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // State Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // --- 1. FIX WARNING: DÙNG USECALLBACK CHO FETCH DATA ---
  // useCallback giúp hàm này không bị tạo lại mỗi lần render trừ khi dependency thay đổi
  const fetchUsers = useCallback(async () => {
      setLoading(true);
      try {
          const res = await axiosClient.get('/users', {
              params: {
                  page: currentPage,
                  limit: 5,
                  search: searchTerm,
                  status: filterStatus
              }
          });
          
          setUsers(res.users);
          setTotalPages(res.totalPages);
          setTotalUsers(res.totalUsers);
      } catch (error) {
          console.error("Lỗi tải danh sách user:", error);
      } finally {
          setLoading(false);
      }
  }, [currentPage, searchTerm, filterStatus]); // Hàm sẽ chỉ tạo lại khi 3 biến này thay đổi

  // useEffect bây giờ chỉ cần phụ thuộc vào fetchUsers (đã an toàn nhờ useCallback)
  useEffect(() => {
      const timeout = setTimeout(() => {
          fetchUsers();
      }, 500); // Debounce 500ms
      return () => clearTimeout(timeout);
  }, [fetchUsers]); 

  // --- 2. HÀM XỬ LÝ ---
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 1 ? 'KHÓA' : 'MỞ KHÓA';
    if(window.confirm(`Xác nhận ${action} tài khoản này?`)) {
        try {
            const res = await axiosClient.put(`/users/${id}/status`);
            if (res.success) {
                setUsers(users.map(u => u._id === id ? { ...u, status: res.newStatus } : u));
                if (selectedUser && selectedUser._id === id) {
                    setSelectedUser(prev => ({ ...prev, status: res.newStatus }));
                }
            }
        } catch {
            alert("Lỗi cập nhật trạng thái");
        }
    }
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleFilterChange = (e) => { setFilterStatus(e.target.value); setCurrentPage(1); };

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Người Dùng</h2>
            <p className="text-muted small m-0"><FaUsers className="me-1"/>Tổng số: {totalUsers} tài khoản</p>
        </div>
        <Button variant="outline-success" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2">
            <FaDownload /> Xuất danh sách
        </Button>
      </div>

      {/* FILTER BAR */}
      <div className="table-card p-3 mb-4">
          <Row className="g-3">
              <Col md={5}>
                  <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        placeholder="Tìm kiếm theo tên, email, sđt..." 
                        className="border-start-0 shadow-none"
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                  </InputGroup>
              </Col>
              <Col md={3}>
                  <Form.Select className="shadow-none" value={filterStatus} onChange={handleFilterChange}>
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

      {/* TABLE */}
      <div className="table-card overflow-hidden">
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead>
                  <tr>
                      <th className="ps-4">Người Dùng</th>
                      <th>Liên Hệ</th>
                      <th>Vai Trò</th>
                      <th className="text-center">Ngày Tham Gia</th>
                      <th>Trạng Thái</th>
                      <th className="text-end pe-4">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan="6" className="text-center py-5"><Spinner animation="border" variant="success"/></td></tr>
                  ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img 
                                        src={user.avatarUrl || "https://via.placeholder.com/150"} 
                                        alt={user.name} 
                                        className="rounded-circle border object-fit-cover" 
                                        style={{width: 45, height: 45}}
                                    />
                                    <div>
                                        <div className="fw-bold" style={{color: 'var(--admin-text)'}}>{user.name}</div>
                                        <small className="text-muted text-uppercase" style={{fontSize: '0.7rem'}}>ID: {user._id.slice(-6)}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div>{user.email}</div>
                                <small className="text-muted">{user.phone || "N/A"}</small>
                            </td>
                            <td>
                                <Badge bg={user.role?.name === 'admin' ? 'dark' : user.role?.name === 'manager' ? 'primary' : 'info'} className="text-uppercase">
                                    {user.role?.name || 'Customer'}
                                </Badge>
                            </td>
                            <td className="text-center">
                                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                            </td>
                            <td>
                                {user.status === 1 ? (
                                    <Badge bg="success" className="rounded-pill px-3 bg-opacity-75">Active</Badge>
                                ) : (
                                    <Badge bg="danger" className="rounded-pill px-3 bg-opacity-75">Locked</Badge>
                                )}
                            </td>
                            <td className="text-end pe-4">
                                <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-primary hover-scale me-2" onClick={() => handleViewUser(user)}>
                                    <FaEye className="me-1"/> Xem
                                </Button>
                                {user.role?.name !== 'admin' && (
                                    user.status === 1 ? (
                                        <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-danger hover-scale" onClick={() => handleToggleStatus(user._id, 1)} title="Khóa">
                                            <FaLock/>
                                        </Button>
                                    ) : (
                                        <Button variant="light" size="sm" className="rounded-pill border shadow-sm text-success hover-scale" onClick={() => handleToggleStatus(user._id, 0)} title="Mở khóa">
                                            <FaUnlock/>
                                        </Button>
                                    )
                                )}
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr><td colSpan="6" className="text-center py-5 text-muted">Không tìm thấy người dùng nào.</td></tr>
                  )}
              </tbody>
          </Table>
          
          {/* 3. KHÔI PHỤC PAGINATION GỐC ĐẸP MẮT */}
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
                      Hiển thị trang {currentPage} trên tổng số {totalPages} trang
                  </small>
              </div>
          )}
      </div>

      {/* MODAL */}
      <CustomerDetailModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        customer={selectedUser}
        handleToggleStatus={handleToggleStatus}
      />
    </div>
  );
};

export default CustomerManager;