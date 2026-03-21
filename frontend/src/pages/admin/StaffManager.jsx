import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Table, Button, Form, InputGroup, Badge, Pagination, Spinner } from 'react-bootstrap';
import { FaSearch, FaFilter, FaEye, FaTrash, FaUserTie, FaUserShield, FaUserCog, FaSyncAlt, FaPlus, FaIdBadge } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import StaffModal from '../../components/admin/StaffModal';
import axiosClient from '../../services/axiosClient';
import userApi from '../../services/user.service';
import '../../assets/styles/admin.css';

const HighlightText = ({ text, highlight }) => {
  if (!highlight || !text) return <>{text}</>;
  const safeHighlight = highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.toString().split(new RegExp(`(${safeHighlight})`, 'gi'));
  return (
    <>{parts.map((part, index) => part.toLowerCase() === highlight.toLowerCase() ? <mark key={index} className="bg-warning text-dark px-1 rounded p-0">{part}</mark> : <span key={index}>{part}</span>)}</>
  );
};

const StaffManager = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';
  const filterStatus = searchParams.get('status') || 'All';
  const filterRole = searchParams.get('role') || 'All'; // STATE MỚI: Lọc cấp bậc
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchTerm);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, active: 0, locked: 0, totalPages: 1 });

  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const updateParams = useCallback((key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== '') newParams.set(key, value);
    else newParams.delete(key);
    
    if (key !== "page") newParams.set("page", "1");
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const timer = setTimeout(() => { if (searchInput !== searchTerm) updateParams("search", searchInput); }, 500);
    return () => clearTimeout(timer);
  }, [searchInput, searchTerm, updateParams]);

  useEffect(() => { setSearchInput(searchTerm); }, [searchTerm]);

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput("");
  };

  const fetchUsers = useCallback(async () => {
      setLoading(true);
      try {
          const res = await axiosClient.get('/users', {
              params: { 
                  page: currentPage, limit: 10, search: searchTerm, 
                  status: filterStatus, roleType: 'staff', specificRole: filterRole 
              }
          });
          setUsers(res.users);
          setStats({ total: res.totalUsers, active: res.activeUsers, locked: res.lockedUsers, totalPages: res.totalPages });
      } catch {
          toast.error("Lỗi tải danh sách nhân sự");
      } finally {
          setLoading(false);
      }
  }, [currentPage, searchTerm, filterStatus, filterRole]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleAddNew = () => { setSelectedStaff(null); setShowModal(true); };
  const handleEditStaff = (staff) => { setSelectedStaff(staff); setShowModal(true); };

  const handleDelete = async (id, roleName) => {
    if(roleName === 'admin') { toast.error("Không thể xóa tài khoản Admin cấp cao!"); return; }
    if (window.confirm("Bạn có chắc chắn muốn thu hồi (xóa) tài khoản nhân sự này?")) {
        try {
            await userApi.deleteUser(id);
            toast.success("Đã xóa tài khoản thành công!");
            fetchUsers(); 
        } catch (error) {
            toast.error(error.response?.data?.message || "Không thể xóa nhân sự này.");
        }
    }
  };

  // HÀM MỚI: Khóa/Mở khóa để truyền vào Modal
  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1; 
    try {
        const res = await axiosClient.put(`/users/${id}/status`);
        if (res.success) {                            
            setUsers(prevUsers => prevUsers.map(u => u._id === id ? { ...u, status: nextStatus } : u));
            fetchUsers(); 
            toast.success("Cập nhật trạng thái thành công!"); 
        }
    } catch {            
        toast.error("Lỗi cập nhật trạng thái.");
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Quản Lý Nội Bộ</h2>
            <p className="text-muted small m-0 mt-1">Danh sách Quản trị viên và Nhân viên hệ thống</p>
        </div>
        <div className="d-flex gap-2">
            <Button variant="success" className="rounded-pill px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2" onClick={handleAddNew}>
                <FaPlus /> Thêm Nhân Sự
            </Button>
        </div>
      </div>

      <Row className="mb-4 g-3">
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-dark bg-opacity-10 text-dark rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaUserShield size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{stats.total}</h3>
                <span className="text-muted small">Tổng Nhân Sự</span>
             </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-primary bg-opacity-10 text-primary rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaUserTie size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{stats.active}</h3>
                <span className="text-muted small">Đang Hoạt Động</span>
             </div>
          </div>
        </Col>
        <Col xs={12} md={4}>
          <div className="bg-white p-3 rounded-4 shadow-sm border d-flex align-items-center gap-3">
             <div className="bg-danger bg-opacity-10 text-danger rounded-circle d-flex justify-content-center align-items-center flex-shrink-0" style={{width: '56px', height: '56px'}}><FaUserCog size={24}/></div>
             <div>
                <h3 className="fw-bold m-0 text-dark">{stats.locked}</h3>
                <span className="text-muted small">Đã Bị Khóa</span>
             </div>
          </div>
        </Col>
      </Row>

      <div className="table-card p-3 mb-4 bg-white border rounded shadow-sm">          
          <Row className="g-3 align-items-center">
              <Col xs={12} md={4}>
                  <InputGroup>
                      <InputGroup.Text className="bg-light border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>                      
                      <Form.Control 
                        type="text" placeholder="Tìm theo tên, email..." 
                        className="border-start-0 shadow-none bg-light"
                        value={searchInput} onChange={(e) => setSearchInput(e.target.value)} 
                      />
                  </InputGroup>
              </Col>
              {/* LỌC THEO CẤP BẬC */}
              <Col xs={12} md={3}>                  
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0"><FaIdBadge className="text-muted" size={14}/></InputGroup.Text>
                    <Form.Select className="border-start-0 shadow-none bg-light" value={filterRole} onChange={(e) => updateParams("role", e.target.value)}>
                        <option value="All">-- Tất cả Cấp Bậc --</option>
                        <option value="admin">Quản trị viên (Admin)</option>
                        <option value="manager">Quản lý (Manager)</option>
                        <option value="staff">Nhân viên (Staff)</option>
                    </Form.Select>
                  </InputGroup>
              </Col>
              <Col xs={12} md={3}>                  
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0"><FaFilter className="text-muted" size={12}/></InputGroup.Text>
                    <Form.Select className="border-start-0 shadow-none bg-light" value={filterStatus} onChange={(e) => updateParams("status", e.target.value)}>
                        <option value="All">-- Tất cả Trạng thái --</option>
                        <option value="Active">Đang hoạt động</option>
                        <option value="Locked">Đã bị khóa</option>
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

      <div className="table-card border rounded shadow-sm bg-white" style={{ maxHeight: '600px', overflowY: 'auto' }}>
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8f9fa', zIndex: 1, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                  <tr>
                      <th className="ps-4 py-3">Nhân Sự</th>
                      <th className="py-3">Chức Vụ</th>
                      <th className="py-3 text-center">Liên Hệ</th>
                      <th className="py-3 text-center">Trạng Thái</th>
                      <th className="text-end pe-4 py-3">Hành Động</th>
                  </tr>
              </thead>
              <tbody>
                  {loading ? (
                      <tr><td colSpan={5} className="text-center py-5 border-bottom-0"><Spinner animation="border" variant="success"/></td></tr>
                  ) : users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user._id}>
                            <td className="ps-4">
                                <div className="d-flex align-items-center gap-3">
                                    <img src={user.avatarUrl || "https://via.placeholder.com/150"} alt={user.name} className="rounded-circle border object-fit-cover" style={{width: 45, height: 45}} />
                                    <div>
                                        <div className="fw-bold text-dark"><HighlightText text={user.name} highlight={searchTerm} /></div>
                                        <small className="text-muted text-uppercase" style={{fontSize: '0.7rem'}}>ID: {user._id.slice(-6)}</small>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <Badge bg={user.role?.name === 'admin' ? 'dark' : user.role?.name === 'manager' ? 'primary' : 'info'} className="px-3 py-2 text-uppercase">
                                    {user.role?.name}
                                </Badge>
                            </td>
                            <td className="text-center">
                                <div><HighlightText text={user.email} highlight={searchTerm} /></div>
                            </td>
                            <td className="text-center">
                                {user.status === 1 ? <Badge bg="success" className="rounded-pill px-3 bg-opacity-75">Active</Badge> : <Badge bg="danger" className="rounded-pill px-3 bg-opacity-75">Locked</Badge>}
                            </td>
                            <td className="text-end pe-4">
                                <div className="d-flex justify-content-end gap-2">
                                    <Button variant="light" size="sm" className="rounded-circle border shadow-sm text-primary hover-scale" onClick={() => handleEditStaff(user)}>
                                        <FaEye />
                                    </Button>
                                    <Button 
                                        variant="light" size="sm" className="rounded-circle border shadow-sm text-danger hover-scale" 
                                        onClick={() => handleDelete(user._id, user.role?.name)}
                                        disabled={user.role?.name === 'admin'}
                                    >
                                        <FaTrash />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                      ))
                  ) : (
                      <tr>
                          <td colSpan={5} className="border-bottom-0 p-0">
                              <div className="d-flex flex-column align-items-center justify-content-center w-100" style={{ minHeight: '200px' }}>
                                  <FaUserShield size={40} className="mb-3 text-muted opacity-50"/>
                                  <h6 className="text-muted mb-0">Không tìm thấy nhân sự nào.</h6>
                              </div>
                          </td>
                      </tr>
                  )}
              </tbody>
          </Table>
      </div>
      
      {stats.totalPages > 1 && (
          <div className="p-3 border-top d-flex justify-content-center align-items-center bg-white rounded-bottom shadow-sm mt-2">
              <Pagination className="eco-pagination mb-0">
                  <Pagination.Prev onClick={() => updateParams("page", currentPage - 1)} disabled={currentPage === 1}/>
                  {[...Array(stats.totalPages)].map((_, idx) => (
                      <Pagination.Item key={idx + 1} active={idx + 1 === currentPage} onClick={() => updateParams("page", idx + 1)}>
                          {idx + 1}
                      </Pagination.Item>
                  ))}
                  <Pagination.Next onClick={() => updateParams("page", currentPage + 1)} disabled={currentPage === stats.totalPages}/>
              </Pagination>
          </div>
      )}

      <StaffModal 
        show={showModal} 
        handleClose={() => setShowModal(false)}
        staff={selectedStaff}
        refreshData={fetchUsers}
        handleToggleStatus={handleToggleStatus} /* TRUYỀN HÀM XUỐNG MODAL */
      />
    </div>
  );
};

export default StaffManager;