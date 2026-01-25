import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaCamera, FaSave, FaUser, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth';
import axiosClient from '../../services/axiosClient';
import '../../assets/styles/auth-profile.css';

const ProfileInfo = () => {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  // Debug: Kiểm tra xem user thực tế có những gì
  console.log("Current User Info:", user);

  // Khởi tạo state MỘT LẦN DUY NHẤT khi component mount (nhờ key ở cha)
  const [info, setInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    // Fallback nhiều lớp cho SĐT: user.phone -> user.phoneNumber -> rỗng
    phone: user?.phone || user?.phoneNumber || "", 
    gender: user?.gender || "male", // Nếu sau này backend có trả về gender
    birthday: user?.birthday || "", // Tương tự với ngày sinh
    avatar: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
  });

  const handleImageChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      // 1. Hiển thị Preview ngay lập tức cho mượt
      const previewUrl = URL.createObjectURL(file);
      setInfo(prev => ({...prev, avatar: previewUrl}));

      // 2. Gửi file lên Server
      try {
          const formData = new FormData();
          formData.append('avatar', file);

          // Gọi API (đường dẫn tùy backend bạn cấu hình ở Bước 2)
          const res = await axiosClient.post('/auth/upload-avatar', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });

          if (res.success) {
              // 3. Server trả về link ảnh thật -> Cập nhật vào Global Context
              // Bước này sẽ làm Header và Sidebar đổi ảnh NGAY LẬP TỨC
              updateUser({ avatarUrl: res.avatarUrl }); 
              
              // Cập nhật lại state local bằng link thật (thay thế link preview)
              setInfo(prev => ({...prev, avatar: res.avatarUrl}));
              
              alert("Đã cập nhật ảnh đại diện!");
          }
      } catch (error) {
          console.error("Upload error:", error);
          alert("Lỗi khi tải ảnh lên server.");
      }
  };

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
      alert(`Đã cập nhật thông tin: ${info.fullName}`);      
  };

  return (
    <div className="profile-content-card animate-fade-in">
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-success">Thông tin cá nhân</h4>
        
        <div className="text-center mb-5 position-relative">
            <div className="avatar-container">
                <img src={info.avatar} alt="Avatar" className="avatar-img" />
                <label className="avatar-upload-btn" onClick={() => fileInputRef.current.click()}>
                    <FaCamera size={14}/>
                </label>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    style={{display: 'none'}} 
                    accept="image/*" 
                    onChange={handleImageChange}
                />
            </div>
            <p className="text-muted small">Nhấn vào icon máy ảnh để thay đổi.</p>
        </div>

        <Form>
          <Row className="g-4 mb-4">
             <Col md={12}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">HỌ VÀ TÊN</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaUser className="text-muted"/></span>
                        <Form.Control type="text" name="fullName" value={info.fullName} onChange={handleChange} className="modern-input border-start-0 ps-0"/>
                    </div>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">EMAIL</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text bg-light border-end-0"><FaEnvelope className="text-muted"/></span>
                        <Form.Control type="email" name="email" value={info.email} disabled className="modern-input border-start-0 ps-0 bg-light" />
                    </div>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaPhoneAlt className="text-muted"/></span>
                        <Form.Control 
                            type="text" 
                            name="phone" 
                            value={info.phone} 
                            onChange={handleChange} 
                            className="modern-input border-start-0 ps-0"
                            placeholder="Chưa cập nhật"
                        />
                    </div>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">NGÀY SINH</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaCalendarAlt className="text-muted"/></span>
                        <Form.Control type="date" name="birthday" value={info.birthday} onChange={handleChange} className="modern-input border-start-0 ps-0"/>
                    </div>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Label className="fw-bold small text-secondary d-block">GIỚI TÍNH</Form.Label>
                <div className="gender-selector">
                    {['male|Nam', 'female|Nữ', 'other|Khác'].map(opt => {
                        const [val, label] = opt.split('|');
                        return (
                            <label key={val} className="gender-option">
                                <input 
                                    type="radio" 
                                    name="gender" 
                                    value={val} 
                                    checked={info.gender === val} 
                                    onChange={handleChange} 
                                />
                                <span className="gender-label">{label}</span>
                            </label>
                        )
                    })}
                </div>
             </Col>
          </Row>

          <div className="text-end pt-3 border-top">
              <Button variant="success" onClick={handleSave} className="px-5 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                <FaSave /> Lưu Thay Đổi
              </Button>
          </div>
        </Form>
    </div>
  );
};

export default ProfileInfo;