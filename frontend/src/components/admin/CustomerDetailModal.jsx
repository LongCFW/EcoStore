import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Table, Badge, Tabs, Tab, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaUserSlash, FaUserCheck, FaHistory, FaEye, FaEyeSlash, FaTimes, FaCog } from 'react-icons/fa';
import toast from 'react-hot-toast';
import userApi from '../../services/user.service'; 
import axiosClient from '../../services/axiosClient';

const CustomerDetailModal = ({ show, handleClose, customer, handleToggleStatus, refreshData }) => {
  const [key, setKey] = useState('general');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const [localCustomer, setLocalCustomer] = useState(null);

  // Đã xóa hoàn toàn currentPassword khỏi state
  const [formData, setFormData] = useState({
      name: '', email: '', phone: '', newPassword: ''      
  });

  useEffect(() => {
      if (customer) {
          setLocalCustomer(customer);
          setFormData({
              name: customer.name || '',
              email: customer.email || '',
              phone: customer.phone || '',
              newPassword: ''      
          });
          setKey('general'); 
      }
  }, [customer, show]);

  if (!localCustomer) return null;

  const primaryAddress = localCustomer.addresses && localCustomer.addresses.length > 0 
      ? `${localCustomer.addresses[0].addressLine}, ${localCustomer.addresses[0].city}` 
      : "Chưa cập nhật địa chỉ";

  const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdateCustomer = async (e) => {
      e.preventDefault();
      
      // Đã xóa đoạn IF chặn bắt nhập mật khẩu cũ ở đây

      setIsUpdating(true);
      try {
          await userApi.adminUpdateUser(localCustomer._id, formData);
          toast.success("Đã cập nhật thông tin khách hàng!");
          
          if (refreshData) refreshData();
          
          const res = await axiosClient.get(`/users/${localCustomer._id}`);
          setLocalCustomer(res);
          
          // Chỉ reset ô mật khẩu mới cho trống trải
          setFormData(prev => ({...prev, newPassword: ''}));
          
      } catch (error) {
          toast.error(error.response?.data?.message || "Lỗi cập nhật. Vui lòng thử lại.");
      } finally {
          setIsUpdating(false);
      }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" scrollable>
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success">Hồ sơ người dùng</Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        <Row className="mb-4 align-items-center">
            <Col md={3} className="text-center mb-3 mb-md-0">
                <div className="position-relative d-inline-block">
                    <img 
                        src={localCustomer.avatarUrl || "https://via.placeholder.com/150"} 
                        alt="Avatar" 
                        className="rounded-circle border border-3 border-white shadow-sm object-fit-cover"
                        style={{width: '100px', height: '100px'}}
                    />
                    <span className={`position-absolute bottom-0 end-0 p-2 border border-2 border-white rounded-circle ${localCustomer.status === 1 ? 'bg-success' : 'bg-danger'}`}></span>
                </div>
            </Col>
            <Col md={9}>
                <h4 className="fw-bold mb-1">{localCustomer.name}</h4>
                <div className="d-flex flex-wrap gap-3 text-muted mb-2">
                    <span>{localCustomer.email}</span>
                    <span className="d-none d-md-inline">|</span>
                    <span>{localCustomer.phone || "Chưa có SĐT"}</span>
                </div>
                <div className="d-flex gap-2">
                    <Badge bg={localCustomer.status === 1 ? 'success' : 'danger'} className="rounded-pill px-3 py-2">
                        {localCustomer.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}
                    </Badge>
                    <Badge bg="info" className="rounded-pill px-3 py-2 text-uppercase text-dark">
                        {localCustomer.role?.name || 'Customer'}
                    </Badge>
                </div>
            </Col>
        </Row>

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4 border-bottom-0 custom-tabs">
            {/* TỔNG QUAN */}
            <Tab eventKey="general" title="Tổng Quan">
                <div className="bg-light p-3 rounded-3 mb-4 border">
                    <Row className="g-3">
                        <Col sm={6}><small className="text-muted d-block">Địa chỉ mặc định</small> <strong>{primaryAddress}</strong></Col>
                        <Col sm={6}><small className="text-muted d-block">Ngày tham gia</small> <strong>{new Date(localCustomer.createdAt).toLocaleDateString('vi-VN')}</strong></Col>
                        <Col sm={6}><small className="text-muted d-block">Tổng chi tiêu (Demo)</small> <span className="text-success fw-bold">0 đ</span></Col>
                        <Col sm={6}><small className="text-muted d-block">Hạng thành viên (Demo)</small> <Badge bg="secondary">Mới</Badge></Col>
                    </Row>
                </div>

                <h6 className="fw-bold mb-3 text-primary"><FaHistory className="me-2"/>Lịch sử mua hàng (Demo)</h6>
                <div className="table-card overflow-hidden">
                    <Table size="sm" hover className="mb-0 custom-table align-middle">
                        <thead className="bg-light">
                            <tr><th>Mã đơn</th><th>Ngày đặt</th><th>Tổng tiền</th><th>Trạng thái</th></tr>
                        </thead>
                        <tbody>
                            <tr><td colSpan="4" className="text-center text-muted py-3">Chưa có dữ liệu đơn hàng thực tế</td></tr>
                        </tbody>
                    </Table>
                </div>
            </Tab>

            {/* CÀI ĐẶT */}
            <Tab eventKey="settings" title={<span><FaCog className="me-1"/> Cài Đặt</span>}>
                <Form onSubmit={handleUpdateCustomer} className="p-3 border rounded bg-light">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-secondary">Tên Khách Hàng</Form.Label>
                                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} className="shadow-none" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-secondary">Email</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} className="shadow-none" required />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold small text-secondary">Số Điện Thoại</Form.Label>
                        <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} className="shadow-none" required />
                    </Form.Group>

                    {/* Đã gỡ bỏ ô nhập mật khẩu cũ ở đây */}

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold small text-secondary">Mật Khẩu Mới (Bỏ trống nếu không đổi)</Form.Label>
                        <InputGroup>
                            <Form.Control 
                                type={showNewPassword ? "text" : "password"} 
                                name="newPassword" 
                                placeholder="Nhập mật khẩu mới..." 
                                value={formData.newPassword}
                                onChange={handleChange}
                                className="shadow-none border-end-0"
                            />
                            <InputGroup.Text 
                                className="bg-white border-start-0 text-muted" 
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                style={{ cursor: 'pointer' }}
                            >
                                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    
                    <div className="text-end border-top pt-3 mt-2">
                        <Button variant="success" type="submit" disabled={isUpdating} className="fw-bold px-4 rounded-pill">
                            {isUpdating ? <Spinner size="sm" /> : "Lưu Thay Đổi"}
                        </Button>
                    </div>
                </Form>
            </Tab>

            {/* NHẬT KÝ */}
            <Tab eventKey="activity" title="Nhật Ký">
                {localCustomer.activityLogs && localCustomer.activityLogs.length > 0 ? (
                    <ul className="list-group list-group-flush rounded border custom-scrollbar" style={{maxHeight: '350px', overflowY: 'auto'}}>
                        {[...localCustomer.activityLogs].reverse().map((log, i) => {
                            let colorClass = "text-primary";
                            if (log.action.includes('XÓA') || log.action.includes('BỎ')) colorClass = "text-danger";
                            if (log.action.includes('THÀNH CÔNG')) colorClass = "text-success";
                            if (log.action.includes('THÊM')) colorClass = "text-info";

                            return (
                                <li key={i} className="list-group-item py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong className={colorClass}>{log.action}</strong>
                                        <small className="text-muted">{new Date(log.createdAt).toLocaleString('vi-VN')}</small>
                                    </div>
                                    <p className="mb-0 small text-muted mt-1">{log.details}</p>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <div className="text-center py-4 text-muted bg-light rounded border">
                        Chưa có ghi nhận hoạt động nào.
                    </div>
                )}
            </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
        <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Đóng</Button>
        {localCustomer.role?.name !== 'admin' && (
            localCustomer.status === 1 ? (
                <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => {
                    handleToggleStatus(localCustomer._id, 1);
                    setLocalCustomer(prev => ({...prev, status: 0})); 
                }}>
                    <FaUserSlash className="me-2" /> Khóa tài khoản
                </Button>
            ) : (
                 <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => {
                    handleToggleStatus(localCustomer._id, 0);
                    setLocalCustomer(prev => ({...prev, status: 1}));
                 }}>
                    <FaUserCheck className="me-2" /> Mở khóa
                </Button>
            )
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerDetailModal;