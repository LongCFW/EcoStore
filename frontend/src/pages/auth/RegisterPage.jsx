import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaLeaf } from 'react-icons/fa';
import '../../assets/styles/auth-profile.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
      e.preventDefault();
      // Logic đăng ký...
      console.log(formData);
      alert("Đăng ký thành công! (Demo)");
      navigate('/login'); 
  };

  return (
    <div className="auth-wrapper">
      {/* CỘT ẢNH (BÊN TRÁI - Ảnh khác Login chút) */}
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaLeaf size={40} className="text-success"/>
              </div>
              <h1 className="display-4 fw-bold mb-3">Tham Gia Ngay</h1>
              <p className="fs-5 opacity-90">
                  Tạo tài khoản để nhận ngay <strong>Voucher 50k</strong> cho đơn hàng đầu tiên và tích điểm đổi quà không giới hạn.
              </p>
          </div>
      </div>

      {/* CỘT FORM (BÊN PHẢI) */}
      <div className="auth-form-side">
          <Link to="/" className="back-home-btn"><FaArrowLeft/> Về trang chủ</Link>
          
          <div className="auth-form-container">
              <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark mb-2">Tạo Tài Khoản Mới</h2>
                  <p className="text-muted">Nhập thông tin của bạn bên dưới</p>
              </div>

              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">HỌ VÀ TÊN</Form.Label>
                      <Form.Control type="text" name="name" placeholder="Nguyễn Văn A" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">EMAIL</Form.Label>
                      <Form.Control type="email" name="email" placeholder="name@example.com" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small text-secondary">MẬT KHẨU</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Tối thiểu 6 ký tự" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 text-uppercase gradient-btn">
                      Đăng Ký Thành Viên
                  </Button>

                  <div className="text-center mt-4">
                      <span className="text-muted">Đã có tài khoản? </span>
                      <Link to="/login" className="text-decoration-none fw-bold text-success hover-green">Đăng nhập</Link>
                  </div>
              </Form>
          </div>
      </div>
    </div>
  );
};

export default RegisterPage;