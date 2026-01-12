import React, { useState, useRef } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { FaCamera, FaSave, FaUser, FaPhoneAlt, FaEnvelope, FaCalendarAlt } from "react-icons/fa";
import '../../assets/styles/auth-profile.css';

const ProfileInfo = () => {
  const fileInputRef = useRef(null);
  const [info, setInfo] = useState({
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0901234567",
    gender: "male",
    birthday: "1995-10-20",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=500&q=80"
  });

  const handleChange = (e) => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  // Logic Upload Ảnh
  const handleImageChange = (e) => {
      const file = e.target.files[0];
      if(file) {
          const imageUrl = URL.createObjectURL(file);
          setInfo({...info, avatar: imageUrl});
      }
  };

  return (
    <div className="profile-content-card animate-fade-in">
        <h4 className="fw-bold mb-4 pb-3 border-bottom text-success">Thông tin cá nhân</h4>
        
        {/* AVATAR SECTION */}
        <div className="text-center mb-5 position-relative">
            <div className="avatar-container">
                <img src={info.avatar} alt="Avatar" className="avatar-img" />
                
                {/* Nút Upload nằm đè lên góc ảnh */}
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
                        <Form.Control type="email" name="email" value={info.email} onChange={handleChange} className="modern-input border-start-0 ps-0" />
                    </div>
                </Form.Group>
             </Col>
             
             <Col md={6}>
                <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI</Form.Label>
                    <div className="input-group">
                        <span className="input-group-text bg-white border-end-0"><FaPhoneAlt className="text-muted"/></span>
                        <Form.Control type="text" name="phone" value={info.phone} onChange={handleChange} className="modern-input border-start-0 ps-0"/>
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
             
             {/* CUSTOM GENDER SELECTOR (Style nút bấm đẹp) */}
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
              <Button variant="success" className="px-5 py-2 rounded-pill fw-bold shadow-sm d-inline-flex align-items-center gap-2">
                <FaSave /> Lưu Thay Đổi
              </Button>
          </div>
        </Form>
    </div>
  );
};

export default ProfileInfo;