// frontend/src/pages/auth/LoginPage.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authApi from '../../services/auth.service';
import { FaArrowLeft, FaGoogle, FaFacebookF, FaLeaf } from 'react-icons/fa';
import '../../assets/styles/auth-profile.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [rememberMe, setRememberMe] = useState(true); // State ghi nhớ đăng nhập
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError('');
      setLoading(true);

      try {
          const response = await authApi.login(formData);
          
          if (response.success) {
              const { token, user } = response.data;
              
              // Truyền thêm biến rememberMe vào hàm login
              login(user, token, rememberMe);

              // Chuyển hướng
              if (user.role === 'admin' || user.role === 'manager') {
                  navigate('/admin');
              } else {
                  navigate('/');
              }
          }
      } catch (err) {
          console.error("Login failed:", err);
          setError(err.response?.data?.message || "Đăng nhập thất bại.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaLeaf size={40} className="text-success"/>
              </div>
              <h1 className="display-4 fw-bold mb-3">Sống Xanh <br/> Cùng EcoStore</h1>
              <p className="fs-5 opacity-90">Đăng nhập để nhận ưu đãi.</p>
          </div>
      </div>

      <div className="auth-form-side">
          <Link to="/" className="back-home-btn"><FaArrowLeft/> Về trang chủ</Link>
          
          <div className="auth-form-container">
              <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark mb-2">Chào Mừng Trở Lại!</h2>
                  <p className="text-muted">Vui lòng đăng nhập tài khoản của bạn</p>
              </div>

              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">EMAIL</Form.Label>
                      <Form.Control 
                        type="email" name="email" placeholder="name@example.com" 
                        className="modern-input" value={formData.email} onChange={handleChange} required
                      />
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">MẬT KHẨU</Form.Label>
                      <Form.Control 
                        type="password" name="password" placeholder="••••••••" 
                        className="modern-input" value={formData.password} onChange={handleChange} required
                      />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                      {/* Xử lý checkbox Ghi nhớ */}
                      <Form.Check 
                        type="checkbox" 
                        label="Ghi nhớ đăng nhập" 
                        className="small text-muted"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                      />
                      {/* Link tới trang Quên mật khẩu */}
                      <Link to="/forgot-password" className="text-decoration-none small text-success fw-bold hover-green">Quên mật khẩu?</Link>
                  </div>

                  <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 text-uppercase gradient-btn" disabled={loading}>
                      {loading ? "Đang xử lý..." : "Đăng Nhập"}
                  </Button>

                  {/* Social Login (Giao diện) */}
                  <div className="position-relative text-center mb-4">
                      <hr className="text-muted opacity-25" />
                      <span className="bg-white px-3 text-muted small position-absolute top-50 start-50 translate-middle">Hoặc tiếp tục với</span>
                  </div>
                  <div className="d-flex gap-3 mb-4">
                      <Button variant="outline-light" className="w-50 rounded-pill border text-dark fw-bold d-flex align-items-center justify-content-center gap-2">
                          <FaGoogle className="text-danger"/> Google
                      </Button>
                      <Button variant="outline-light" className="w-50 rounded-pill border text-dark fw-bold d-flex align-items-center justify-content-center gap-2">
                          <FaFacebookF className="text-primary"/> Facebook
                      </Button>
                  </div>

                  <div className="text-center mt-4">
                      <span className="text-muted">Chưa có tài khoản? </span>
                      <Link to="/register" className="text-decoration-none fw-bold text-success hover-green">Đăng ký ngay</Link>
                  </div>
              </Form>
          </div>
      </div>
    </div>
  );
};

export default LoginPage;