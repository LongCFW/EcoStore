import React, { useState, useEffect } from 'react';
import { Modal, Button, Row, Col, Badge, Tabs, Tab, Form, InputGroup, Spinner } from 'react-bootstrap';
import { FaEye, FaEyeSlash, FaTimes, FaUserPlus, FaUserEdit, FaHistory, FaUserSlash, FaUserCheck } from 'react-icons/fa';
import toast from 'react-hot-toast';
import userApi from '../../services/user.service'; 
import axiosClient from '../../services/axiosClient';

// Nhận prop handleToggleStatus
const StaffModal = ({ show, handleClose, staff, refreshData, handleToggleStatus }) => {
  const isCreating = !staff;
  const [key, setKey] = useState(isCreating ? 'create' : 'settings');
  const [showPassword, setShowPassword] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [localStaff, setLocalStaff] = useState(null);

  const [formData, setFormData] = useState({
      name: '', email: '', phone: '', password: '', role: 'staff' 
  });

  useEffect(() => {
      if (show) {
          if (staff) {
              setLocalStaff(staff);
              setFormData({
                  name: staff.name || '',
                  email: staff.email || '',
                  phone: staff.phone || '',
                  password: '', 
                  role: staff.role?.name || 'staff'
              });
              setKey('settings'); 
          } else {
              setLocalStaff(null);
              setFormData({ name: '', email: '', phone: '', password: '', role: 'staff' });
              setKey('create');
          }
      }
  }, [staff, show]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
      try {
          if (isCreating) {
              if(formData.password.length < 6) {
                  toast.error("Mật khẩu phải từ 6 ký tự");
                  setIsProcessing(false);
                  return;
              }
              await userApi.createStaff(formData);
              toast.success("Tạo tài khoản nhân sự thành công!");
              if (refreshData) refreshData();
              handleClose(); 
          } else {
              // Gửi toàn bộ formData (bao gồm cả role)
              const updateData = {
                  name: formData.name,
                  email: formData.email,
                  phone: formData.phone,
                  role: formData.role, // Gửi Role mới lên Server
                  newPassword: formData.password 
              };
              await userApi.adminUpdateUser(localStaff._id, updateData);
              toast.success("Cập nhật thông tin thành công!");
              if (refreshData) refreshData();
              
              const res = await axiosClient.get(`/users/${localStaff._id}`);
              setLocalStaff(res);
              setFormData(prev => ({...prev, password: ''}));
          }
      } catch (error) {
          toast.error(error.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
          setIsProcessing(false);
      }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered className="eco-modal" scrollable>
      <Modal.Header className="border-0 bg-light">
        <Modal.Title className="fw-bold text-success">
            {isCreating ? "Thêm Nhân Sự Mới" : "Hồ Sơ Nhân Sự"}
        </Modal.Title>
        <button className="icon-btn border-0 ms-auto" onClick={handleClose}><FaTimes/></button>
      </Modal.Header>

      <Modal.Body className="p-4 custom-scrollbar">
        {!isCreating && localStaff && (
            <Row className="mb-4 align-items-center">
                <Col md={3} className="text-center mb-3 mb-md-0">
                    <img src={localStaff.avatarUrl || "https://via.placeholder.com/150"} alt="Avatar" className="rounded-circle border border-3 border-white shadow-sm object-fit-cover" style={{width: '100px', height: '100px'}}/>
                </Col>
                <Col md={9}>
                    <h4 className="fw-bold mb-1">{localStaff.name}</h4>
                    <div className="d-flex flex-wrap gap-3 text-muted mb-2">
                        <span>{localStaff.email}</span><span>|</span><span>{localStaff.phone || "Chưa có SĐT"}</span>
                    </div>
                    <div className="d-flex gap-2">
                        <Badge bg={localStaff.status === 1 ? 'success' : 'danger'} className="rounded-pill px-3 py-2">
                            {localStaff.status === 1 ? 'Đang hoạt động' : 'Đã khóa'}
                        </Badge>
                        <Badge bg={localStaff.role?.name === 'admin' ? 'dark' : 'primary'} className="rounded-pill px-3 py-2 text-uppercase">
                            {localStaff.role?.name}
                        </Badge>
                    </div>
                </Col>
            </Row>
        )}

        <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-4 border-bottom-0 custom-tabs">
            <Tab eventKey={isCreating ? 'create' : 'settings'} title={<span>{isCreating ? <FaUserPlus className="me-1"/> : <FaUserEdit className="me-1"/>} {isCreating ? "Cấp Tài Khoản" : "Cài Đặt"}</span>}>
                <Form onSubmit={handleSubmit} className="p-3 border rounded bg-light mt-2">
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-secondary">Tên Nhân Viên</Form.Label>
                                <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} className="shadow-none" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold small text-secondary">Email Truy Cập</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} className="shadow-none" required disabled={!isCreating && formData.role === 'admin'} />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-secondary">Số Điện Thoại</Form.Label>
                                <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} className="shadow-none" required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            {/* HIỂN THỊ CẤP QUYỀN Ở CẢ 2 CHẾ ĐỘ (THÊM & SỬA) */}
                            <Form.Group className="mb-4">
                                <Form.Label className="fw-bold small text-secondary">Cấp Quyền (Vai trò)</Form.Label>
                                <Form.Select 
                                    name="role" 
                                    value={formData.role} 
                                    onChange={handleChange} 
                                    className="shadow-none"
                                    disabled={!isCreating && localStaff?.role?.name === 'admin'} // Không cho hạ cấp admin ở Frontend
                                >
                                    <option value="staff">Nhân viên (Staff)</option>
                                    <option value="manager">Quản lý (Manager)</option>
                                    <option value="admin">Quản trị viên (Admin)</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-4">
                        <Form.Label className="fw-bold small text-secondary">
                            {isCreating ? "Mật Khẩu Khởi Tạo" : "Mật Khẩu Mới (Bỏ trống nếu không đổi)"}
                        </Form.Label>
                        <InputGroup>
                            <Form.Control 
                                type={showPassword ? "text" : "password"} 
                                name="password" 
                                placeholder={isCreating ? "Nhập mật khẩu..." : "Nhập mật khẩu mới..."}
                                value={formData.password}
                                onChange={handleChange}
                                className="shadow-none border-end-0"
                                required={isCreating}
                            />
                            <InputGroup.Text className="bg-white border-start-0 text-muted" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                        </InputGroup>
                    </Form.Group>
                    
                    <div className="text-end border-top pt-3 mt-2">
                        <Button variant="success" type="submit" disabled={isProcessing} className="fw-bold px-4 rounded-pill">
                            {isProcessing ? <Spinner size="sm" /> : (isCreating ? "Tạo Tài Khoản" : "Lưu Thay Đổi")}
                        </Button>
                    </div>
                </Form>
            </Tab>

            {!isCreating && localStaff && (
                <Tab eventKey="activity" title={<span><FaHistory className="me-1"/> Nhật Ký</span>}>
                    {localStaff.activityLogs && localStaff.activityLogs.length > 0 ? (
                        <ul className="list-group list-group-flush rounded border mt-2 custom-scrollbar" style={{maxHeight: '350px', overflowY: 'auto'}}>
                            {[...localStaff.activityLogs].reverse().map((log, i) => (
                                <li key={i} className="list-group-item py-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <strong className="text-primary">{log.action}</strong>
                                        <small className="text-muted">{new Date(log.createdAt).toLocaleString('vi-VN')}</small>
                                    </div>
                                    <p className="mb-0 small text-muted mt-1">{log.details}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-4 text-muted bg-light rounded border mt-2">
                            Chưa có ghi nhận hoạt động nào.
                        </div>
                    )}
                </Tab>
            )}
        </Tabs>
      </Modal.Body>

      {/* FOOTER: NÚT KHÓA/MỞ KHÓA KHI CHỈNH SỬA */}
      {!isCreating && localStaff && (
          <Modal.Footer className="border-0 pt-0 pe-4 pb-4">
            <Button variant="light" onClick={handleClose} className="rounded-pill px-4">Đóng</Button>
            
            {localStaff.role?.name !== 'admin' && (
                localStaff.status === 1 ? (
                    <Button variant="danger" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => {
                        handleToggleStatus(localStaff._id, 1);
                        setLocalStaff(prev => ({...prev, status: 0})); 
                    }}>
                        <FaUserSlash className="me-2" /> Khóa tài khoản
                    </Button>
                ) : (
                     <Button variant="success" className="rounded-pill px-4 fw-bold shadow-sm" onClick={() => {
                        handleToggleStatus(localStaff._id, 0);
                        setLocalStaff(prev => ({...prev, status: 1}));
                     }}>
                        <FaUserCheck className="me-2" /> Mở khóa
                    </Button>
                )
            )}
          </Modal.Footer>
      )}
    </Modal>
  );
};

export default StaffModal;