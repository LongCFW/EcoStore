// frontend/src/pages/auth/ForgotPasswordPage.jsx
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaKey, FaShieldAlt } from 'react-icons/fa';
import authApi from '../../services/auth.service'; // Import API
import '../../assets/styles/auth-profile.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ email: '', phone: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Bước 1: Xác minh
  const handleVerifyIdentity = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        // GỌI API THẬT
        const res = await authApi.verifyReset({ email: formData.email, phone: formData.phone });
        
        if (res.success) {
            setStep(2); // Chuyển sang bước đổi pass
        }
    } catch (err) {
        setError(err.response?.data?.message || "Thông tin xác thực không đúng.");
    } finally {
        setLoading(false);
    }
  };

  // Bước 2: Đổi pass
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        return;
    }
    
    setLoading(true);
    try {
        // GỌI API THẬT
        const res = await authApi.resetPassword({ 
            email: formData.email, 
            phone: formData.phone, // Cần gửi lại thông tin xác thực để backend check
            newPassword: formData.newPassword 
        });

        if (res.success) {
            alert("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
            navigate('/login');
        }
    } catch (err) {
        setError(err.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaKey size={40} className="text-warning"/>
              </div>
              <h1 className="display-4 fw-bold mb-3">Khôi Phục Tài Khoản</h1>
              <p className="fs-5 opacity-90">Đừng lo lắng, chúng tôi sẽ giúp bạn lấy lại mật khẩu một cách an toàn.</p>
          </div>
      </div>

      <div className="auth-form-side">
          <Link to="/login" className="back-home-btn"><FaArrowLeft/> Quay lại đăng nhập</Link>
          
          <div className="auth-form-container">
              <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark mb-2">Quên Mật Khẩu?</h2>
                  <p className="text-muted">
                      {step === 1 ? "Nhập thông tin đã đăng ký để xác minh danh tính." : "Thiết lập mật khẩu mới cho tài khoản của bạn."}
                  </p>
              </div>

              {error && <Alert variant="danger" className="text-center">{error}</Alert>}

              {step === 1 ? (
                  <Form onSubmit={handleVerifyIdentity}>
                      <Form.Group className="mb-3">
                          <Form.Label className="fw-bold small text-secondary">EMAIL ĐÃ ĐĂNG KÝ</Form.Label>
                          <Form.Control type="email" name="email" placeholder="name@example.com" className="modern-input" onChange={handleChange} required/>
                      </Form.Group>
                      <Form.Group className="mb-4">
                          <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI XÁC THỰC</Form.Label>
                          <Form.Control type="tel" name="phone" placeholder="Số điện thoại của bạn" className="modern-input" onChange={handleChange} required/>
                          <Form.Text className="text-muted small">
                              <FaShieldAlt className="me-1 text-success"/> Chúng tôi dùng SĐT để đảm bảo chính chủ.
                          </Form.Text>
                      </Form.Group>
                      <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 gradient-btn" disabled={loading}>
                          {loading ? "Đang xác minh..." : "Tiếp Tục"}
                      </Button>
                  </Form>
              ) : (
                  <Form onSubmit={handleResetPassword}>
                      <Form.Group className="mb-3">
                          <Form.Label className="fw-bold small text-secondary">MẬT KHẨU MỚI</Form.Label>
                          <Form.Control type="password" name="newPassword" placeholder="••••••••" className="modern-input" onChange={handleChange} required/>
                      </Form.Group>
                      <Form.Group className="mb-4">
                          <Form.Label className="fw-bold small text-secondary">XÁC NHẬN MẬT KHẨU</Form.Label>
                          <Form.Control type="password" name="confirmPassword" placeholder="••••••••" className="modern-input" onChange={handleChange} required/>
                      </Form.Group>
                      <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 gradient-btn" disabled={loading}>
                          {loading ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                      </Button>
                  </Form>
              )}
          </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;