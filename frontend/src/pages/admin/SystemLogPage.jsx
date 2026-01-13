import React, { useState } from 'react';
import { Table, Button, Form, InputGroup, Badge, Pagination, Row, Col } from 'react-bootstrap';
import { FaSearch, FaFilter, FaTrashAlt, FaShieldAlt } from 'react-icons/fa';
import '../../assets/styles/admin.css';

const SystemLogPage = () => {
  // 1. DATA GIẢ LẬP (Được tạo 1 lần duy nhất khi khởi tạo state)
  const [logs, setLogs] = useState(() => {
      const data = [];
      const actions = ["Login", "Logout", "Create Product", "Delete Order", "Update Settings", "Export Data"];
      const users = ["Admin", "Manager A", "Staff B", "System"];
      
      for (let i = 1; i <= 50; i++) {
          const actionType = actions[i % actions.length];
          const userType = users[i % users.length];
          const isError = i % 10 === 0; 

          data.push({
              id: i,
              action: actionType,
              user: userType,
              detail: `Thực hiện thao tác ${actionType} trên hệ thống`,
              ip: `192.168.1.${i}`,
              time: `20/01/2025 10:${i < 10 ? '0' + i : i}`,
              status: isError ? 'Failed' : 'Success'
          });
      }
      return data.reverse(); 
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 

  // --- LOGIC LỌC & PHÂN TRANG ---
  const filteredLogs = logs.filter(log => 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredLogs.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => setCurrentPage(page);
  
  const handleSearch = (e) => { 
      setSearchTerm(e.target.value); 
      setCurrentPage(1); 
  };

  // FIX: Sử dụng setLogs để xóa dữ liệu -> Hết lỗi unused var
  const handleDeleteLogs = () => {
      if(window.confirm("Bạn có chắc muốn xóa toàn bộ log cũ hơn 30 ngày?")) {
          // Demo: Xóa sạch danh sách hoặc lọc bớt
          setLogs([]); 
          alert("Đã xóa toàn bộ nhật ký hệ thống!");
      }
  }

  // Helper Badge Color
  const getStatusBadge = (status) => {
      return status === 'Success' 
        ? <Badge bg="success" className="bg-opacity-10 text-success border border-success px-3 py-1 rounded-pill">Thành công</Badge>
        : <Badge bg="danger" className="bg-opacity-10 text-danger border border-danger px-3 py-1 rounded-pill">Thất bại</Badge>;
  };

  return (
    <div className="animate-fade-in">
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
        <div>
            <h2 className="fw-bold m-0" style={{color: 'var(--admin-text)'}}>Nhật Ký Hoạt Động</h2>
            <p className="text-muted small m-0"><FaShieldAlt className="me-1"/>Ghi lại toàn bộ thao tác hệ thống</p>
        </div>
        <Button variant="outline-danger" className="rounded-pill px-4 d-flex align-items-center gap-2" onClick={handleDeleteLogs}>
            <FaTrashAlt /> Xóa log cũ (30 ngày)
        </Button>
      </div>

      {/* FILTER */}
      <div className="table-card p-3 mb-4">
          <Row className="g-3">
              <Col md={6}>
                  <InputGroup>
                      <InputGroup.Text className="bg-white border-end-0"><FaSearch className="text-muted"/></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        placeholder="Tìm kiếm hành động, người dùng..." 
                        className="border-start-0 shadow-none"
                        value={searchTerm}
                        onChange={handleSearch}
                      />
                  </InputGroup>
              </Col>
              <Col md={6} className="text-md-end">
                  <Button variant="outline-secondary"><FaFilter className="me-2"/> Lọc theo ngày</Button>
              </Col>
          </Row>
      </div>

      {/* TABLE LOGS */}
      <div className="table-card overflow-hidden">
          <Table hover responsive className="custom-table align-middle mb-0">
              <thead>
                  <tr>
                      <th className="ps-4">ID</th>
                      <th>Người Dùng</th>
                      <th>Hành Động</th>
                      <th>Chi Tiết</th>
                      <th>IP</th>
                      <th>Thời Gian</th>
                      <th className="text-end pe-4">Trạng Thái</th>
                  </tr>
              </thead>
              <tbody>
                  {currentItems.length > 0 ? (
                      currentItems.map((log) => (
                        <tr key={log.id}>
                            <td className="ps-4 text-muted">#{log.id}</td>
                            <td className="fw-bold" style={{color: 'var(--admin-text)'}}>{log.user}</td>
                            <td>
                                <span className={`fw-bold ${log.action.includes('Delete') ? 'text-danger' : 'text-primary'}`}>
                                    {log.action}
                                </span>
                            </td>
                            <td className="text-muted small">{log.detail}</td>
                            <td className="text-muted small font-monospace">{log.ip}</td>
                            <td>{log.time}</td>
                            <td className="text-end pe-4">{getStatusBadge(log.status)}</td>
                        </tr>
                      ))
                  ) : (
                      <tr><td colSpan="7" className="text-center py-5 text-muted">Không tìm thấy nhật ký nào.</td></tr>
                  )}
              </tbody>
          </Table>

          {/* PAGINATION */}
          {totalPages > 1 && (
              <div className="p-3 border-top d-flex justify-content-center align-items-center flex-column">
                  <Pagination className="eco-pagination mb-2">
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                      {[...Array(totalPages)].map((_, idx) => (
                          <Pagination.Item 
                            key={idx + 1} 
                            active={idx + 1 === currentPage} 
                            onClick={() => handlePageChange(idx + 1)}
                          >
                              {idx + 1}
                          </Pagination.Item>
                      ))}
                      <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}/>
                  </Pagination>
                  <small className="text-muted">
                      Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filteredLogs.length)} trên tổng số {filteredLogs.length} dòng nhật ký
                  </small>
              </div>
          )}
      </div>
    </div>
  );
};

export default SystemLogPage;