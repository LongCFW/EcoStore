import React, { useState, useRef } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaCamera, FaKey, FaUserCheck } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../services/axiosClient';

const AdminProfile = () => {
  const { user, updateUser } = useAuth(); // Lấy hàm updateUser
  const fileInputRef = useRef(null);
  
  const demoAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  
  // State thông tin
  const [info, setInfo] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "",
    phone: user?.phone || ""
  });

  // State mật khẩu
  const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
  
  // State thông báo
  const [status, setStatus] = useState({ show: false, type: 'success', msg: '' });

  // --- 1. HÀM UPLOAD ẢNH (Giữ nguyên như cũ) ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const res = await axiosClient.post('/auth/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.success) {
            updateUser({ avatarUrl: res.avatarUrl });
            showAlert('success', 'Đã cập nhật ảnh đại diện!');
        }
    } catch {
        showAlert('danger', 'Lỗi khi tải ảnh lên server.');
    }
  };

  // --- 2. HÀM LƯU THÔNG TIN (UPDATE PROFILE) ---
  const handleSaveInfo = async () => {
      try {
          // Gọi API Backend
          const res = await axiosClient.put('/auth/profile/update', {
              name: info.name,
              phone: info.phone
          });

          if (res.success) {
              // Quan trọng: Gọi updateUser để Header và các chỗ khác tự đổi tên/sđt
              updateUser({ 
                  name: res.user.name, 
                  phone: res.user.phone 
              });
              
              showAlert('success', 'Cập nhật thông tin thành công!');
          }
      } catch (error) {
          console.error(error);
          showAlert('danger', error.response?.data?.message || 'Lỗi cập nhật thông tin');
      }
  };

  // --- 3. HÀM ĐỔI MẬT KHẨU ---
  const handleChangePassword = async () => {
      // Validate cơ bản
      if (!pass.current || !pass.new || !pass.confirm) {
          showAlert('warning', 'Vui lòng nhập đầy đủ các trường mật khẩu');
          return;
      }
      if (pass.new !== pass.confirm) {
          showAlert('warning', 'Mật khẩu xác nhận không khớp!');
          return;
      }
      if (pass.new.length < 6) {
          showAlert('warning', 'Mật khẩu mới phải từ 6 ký tự trở lên');
          return;
      }

      try {
          // Gọi API Backend
          const res = await axiosClient.put('/auth/profile/change-password', {
              currentPassword: pass.current,
              newPassword: pass.new
          });

          if (res.success) {
              showAlert('success', 'Đổi mật khẩu thành công!');
              setPass({ current: '', new: '', confirm: '' }); // Reset form
          }
      } catch (error) {
          console.error(error);
          showAlert('danger', error.response?.data?.message || 'Mật khẩu hiện tại không đúng!');
      }
  };

  // Helper hiển thị thông báo
  const showAlert = (type, msg) => {
      setStatus({ show: true, type, msg });
      setTimeout(() => setStatus({ ...status, show: false }), 3000);
  };

  const handleChangeInfo = (e) => setInfo({...info, [e.target.name]: e.target.value});
  const handleChangePass = (e) => setPass({...pass, [e.target.name]: e.target.value});

  const currentAvatar = user?.avatarUrl || demoAvatar;

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Hồ sơ cá nhân</h2>
      
      {status.show && <Alert variant={status.type} className="mb-4">{status.msg}</Alert>}

      <Row className="g-4">
        {/* CỘT TRÁI: Avatar & Info Summary */}
        <Col lg={4}>
            <div className="admin-profile-card text-center">
                <div className="admin-profile-header">
                    <h5 className="fw-bold mb-1 text-white">{info.role}</h5>
                    <small className="text-white-50">Email: {info.email}</small>
                </div>
                
                <div className="admin-avatar-wrapper">
                    <img 
                        src={currentAvatar} 
                        alt="Avatar" 
                        className="admin-avatar"
                        style={{ objectFit: 'cover' }} 
                    />
                    <button 
                        className="icon-btn position-absolute bottom-0 end-0 bg-white text-success border-success shadow-sm" 
                        style={{width: 35, height: 35}}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <FaCamera size={14}/>
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{display: 'none'}} 
                        accept="image/*" 
                        onChange={handleImageChange} 
                    />
                </div>

                <div className="admin-profile-body">
                    <h4 className="fw-bold mb-1" style={{color: 'var(--admin-text)'}}>{info.name}</h4>
                    <p className="text-muted mb-4">{info.email}</p>
                    <div className="d-flex justify-content-center gap-2">
                        <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                            <FaUserCheck className="me-2"/> Đang hoạt động
                        </span>
                    </div>
                </div>
            </div>
        </Col>

        {/* CỘT PHẢI: Form Update */}
        <Col lg={8}>
            <div className="admin-profile-card">
                <div className="p-4">
                    {/* --- FORM THÔNG TIN --- */}
                    <h5 className="fw-bold mb-4 pb-2 border-bottom border-secondary border-opacity-10 text-success">
                        Thông tin chi tiết
                    </h5>
                    
                    <Row className="g-3 mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Họ và tên</Form.Label>
                                <Form.Control type="text" name="name" value={info.name} onChange={handleChangeInfo} className="admin-input"/>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="admin-label">Số điện thoại</Form.Label>
                                <Form.Control type="text" name="phone" value={info.phone} onChange={handleChangeInfo} className="admin-input"/>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="admin-label">Email (Không thể thay đổi)</Form.Label>
                                <Form.Control type="email" value={info.email} disabled className="admin-input opacity-75" style={{backgroundColor: 'rgba(0,0,0,0.05)'}}/>
                            </Form.Group>
                        </Col>
                    </Row>

                    <div className="text-end mb-5">
                        <Button variant="success" onClick={handleSaveInfo} className="px-4 fw-bold shadow-sm">
                            <FaSave className="me-2"/> Lưu thông tin
                        </Button>
                    </div>

                    {/* --- FORM MẬT KHẨU --- */}
                    <h5 className="fw-bold mb-4 pb-2 border-bottom border-secondary border-opacity-10 text-danger">
                        <FaKey className="me-2"/> Bảo mật
                    </h5>
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="admin-label">Mật khẩu hiện tại</Form.Label>
                                <Form.Control type="password" name="current" value={pass.current} onChange={handleChangePass} placeholder="•••" className="admin-input"/>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="admin-label">Mật khẩu mới</Form.Label>
                                <Form.Control type="password" name="new" value={pass.new} onChange={handleChangePass} placeholder="•••" className="admin-input"/>
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label className="admin-label">Xác nhận mật khẩu</Form.Label>
                                <Form.Control type="password" name="confirm" value={pass.confirm} onChange={handleChangePass} placeholder="•••" className="admin-input"/>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="text-end mt-4">
                        <Button variant="outline-danger" onClick={handleChangePassword} className="px-4 fw-bold">
                            Đổi mật khẩu
                        </Button>
                    </div>
                </div>
            </div>
        </Col>
      </Row>
    </div>
  );
};

export default AdminProfile;