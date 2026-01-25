import React, { useState, useRef } from 'react'; // Thêm useRef
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaSave, FaCamera, FaKey, FaUserCheck } from 'react-icons/fa';
// 1. Import axiosClient để gọi API và useAuth
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../services/axiosClient'; // Đảm bảo đường dẫn đúng

const AdminProfile = () => {
  // 2. Lấy thêm hàm updateUser từ Context để đồng bộ Header
  const { user, updateUser } = useAuth();
  
  // 3. Tạo Ref để kích hoạt input file ẩn
  const fileInputRef = useRef(null);
  
  const demoAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";
  
  // State form
  const [info, setInfo] = useState({
    name: user?.name || "Admin User",
    email: user?.email || "admin@ecostore.com",
    role: user?.role || "Administrator",
    phone: user?.phone || ""
  });

  const [pass, setPass] = useState({ current: '', new: '', confirm: '' });
  const [showSuccess, setShowSuccess] = useState(false);

  // --- 4. HÀM XỬ LÝ UPLOAD ẢNH (Tái sử dụng logic bên Client) ---
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        // Tạo FormData gửi lên Server
        const formData = new FormData();
        formData.append('avatar', file);

        // Gọi API Upload (Dùng chung API với Client)
        const res = await axiosClient.post('/auth/upload-avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (res.success) {
            // CẬP NHẬT CONTEXT NGAY LẬP TỨC
            // Việc này sẽ làm AdminHeader và Avatar ở đây đổi ảnh ngay
            updateUser({ avatarUrl: res.avatarUrl });
            
            alert("Đã cập nhật ảnh đại diện Admin!");
        }
    } catch (error) {
        console.error("Lỗi upload admin:", error);
        alert("Lỗi khi tải ảnh lên server.");
    }
  };
  // -------------------------------------------------------------

  const handleChangeInfo = (e) => setInfo({...info, [e.target.name]: e.target.value});
  const handleChangePass = (e) => setPass({...pass, [e.target.name]: e.target.value});

  const handleSaveInfo = () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      // TODO: Gọi API update thông tin text nếu cần
  };

  const handleChangePassword = () => {
      if(pass.new !== pass.confirm) {
          alert("Mật khẩu xác nhận không khớp!");
          return;
      }
      alert("Đổi mật khẩu thành công (Demo)");
      setPass({ current: '', new: '', confirm: '' });
  };

  // Lấy ảnh hiển thị: Ưu tiên ảnh từ Context (vừa upload xong) -> DB -> Demo
  const currentAvatar = user?.avatarUrl || demoAvatar;

  return (
    <div>
      <h2 className="fw-bold mb-4" style={{color: 'var(--admin-text)'}}>Hồ sơ cá nhân</h2>
      
      {showSuccess && <Alert variant="success" className="mb-4">Cập nhật thông tin thành công!</Alert>}

      <Row className="g-4">
        {/* CỘT TRÁI: INFO CARD */}
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
                    
                    {/* 5. NÚT CAMERA & INPUT ẨN */}
                    <button 
                        className="icon-btn position-absolute bottom-0 end-0 bg-white text-success border-success shadow-sm" 
                        style={{width: 35, height: 35}}
                        onClick={() => fileInputRef.current.click()} // Kích hoạt input file
                    >
                        <FaCamera size={14}/>
                    </button>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        style={{display: 'none'}} 
                        accept="image/*" 
                        onChange={handleImageChange} // Gọi hàm upload
                    />
                    {/* ------------------------- */}
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

        {/* CỘT PHẢI: FORM (GIỮ NGUYÊN) */}
        <Col lg={8}>
            <div className="admin-profile-card">
                <div className="p-4">
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