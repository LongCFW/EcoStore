// frontend/src/pages/auth/RegisterPage.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../services/auth.service';
import { FaArrowLeft, FaLeaf } from 'react-icons/fa';
import '../../assets/styles/auth-profile.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  // Thêm field phone
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      // Validate cơ bản số điện thoại
      const phoneRegex = /^[0-9]{10,11}$/;
      if (!phoneRegex.test(formData.phone)) {
          setError("Số điện thoại không hợp lệ (10-11 số)");
          setLoading(false);
          return;
      }

      try {
          const response = await authApi.register(formData);
          if (response.success) {
              alert("Đăng ký thành công! Vui lòng đăng nhập.");
              navigate('/login'); 
          }
      } catch (err) {
          console.error("Register failed:", err);
          setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaLeaf size={40} className="text-success"/>
              </div>
              <h1 className="display-4 fw-bold mb-3">Tham Gia Ngay</h1>
              <p className="fs-5 opacity-90">Tạo tài khoản để nhận ngay Voucher 50k.</p>
          </div>
      </div>

      <div className="auth-form-side">
          <Link to="/" className="back-home-btn"><FaArrowLeft/> Về trang chủ</Link>
          <div className="auth-form-container">
              <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark mb-2">Tạo Tài Khoản Mới</h2>
                  <p className="text-muted">Nhập thông tin của bạn bên dưới</p>
              </div>

              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">HỌ VÀ TÊN</Form.Label>
                      <Form.Control type="text" name="name" placeholder="Nguyễn Văn A" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">EMAIL</Form.Label>
                      <Form.Control type="email" name="email" placeholder="name@example.com" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  {/* THÊM TRƯỜNG SỐ ĐIỆN THOẠI */}
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI</Form.Label>
                      <Form.Control type="tel" name="phone" placeholder="0901234567" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small text-secondary">MẬT KHẨU</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Tối thiểu 6 ký tự" className="modern-input" onChange={handleChange} required/>
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 text-uppercase gradient-btn" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Đăng Ký Thành Viên"}
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