import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import authApi from '../../services/auth.service';
import { FaArrowLeft, FaLeaf, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';
import '../../assets/styles/auth-profile.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '', otp: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [phoneError, setPhoneError] = useState(''); // Quản lý lỗi hiển thị tại chỗ cho ô SĐT
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === 'otp' || name === 'phone') {
          const re = /^[0-9\b]+$/;
          if (value === '' || re.test(value)) {
              setFormData({ ...formData, [name]: value });
              
              // VALIDATE THỜI GIAN THỰC CHO SĐT
              if (name === 'phone') {
                  if (value.length > 0 && (value.length < 10 || value.length > 11)) {
                      setPhoneError('Số điện thoại phải từ 10 - 11 số');
                  } else {
                      setPhoneError('');
                  }
              }
          }
      } else {
          setFormData({ ...formData, [name]: value });
      }
      
      if (error) setError('');
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');

    // Chặn nếu SĐT đang bị lỗi
    if (formData.phone.length < 10 || formData.phone.length > 11) {
        setPhoneError('Số điện thoại phải từ 10 - 11 số');
        return;
    }

    setLoading(true);
    try {
      await authApi.sendOtp({ email: formData.email, type: 'register' });
      toast.success("Mã OTP đã được gửi vào email của bạn!");
      setStep(2);
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể gửi OTP. Email có thể đã tồn tại.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.otp.length !== 6) {
        setError("Vui lòng nhập đủ 6 số OTP.");
        return;
    }

    setLoading(true);
    try {
      const res = await authApi.register(formData);
      if (res.success) {
        toast.success("Đăng ký thành công!");
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || "Mã OTP không chính xác.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content text-center">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaLeaf size={40} className="text-success"/>
              </div>
              <h1 className="display-4 fw-bold mb-3 text-white">Tham Gia Ngay</h1>
              <p className="fs-5 opacity-90 text-white">Trở thành thành viên của cộng đồng sống xanh.</p>
          </div>
      </div>

      <div className="auth-form-side">
          <Link to="/" className="back-home-btn"><FaArrowLeft/> Về trang chủ</Link>
          <div className="auth-form-container">
              <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-2">{step === 1 ? "Tạo Tài Khoản" : "Xác Thực Email"}</h2>
                  <p className="text-muted">{step === 1 ? "Vui lòng điền thông tin bên dưới" : `Mã xác thực đã gửi đến ${formData.email}`}</p>
              </div>

              {/* Thông báo lỗi tổng quát */}
              {error && <Alert variant="danger" className="text-center py-2 small">{error}</Alert>}

              {step === 1 ? (
                <Form onSubmit={handleRequestOTP}>
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">HỌ VÀ TÊN</Form.Label>
                      <Form.Control type="text" name="name" placeholder="Nguyễn Văn A" className="modern-input" value={formData.name} onChange={handleChange} required />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">EMAIL</Form.Label>
                      <Form.Control type="email" name="email" placeholder="name@example.com" className="modern-input" value={formData.email} onChange={handleChange} required />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                      <Form.Label className="fw-bold small text-secondary">SỐ ĐIỆN THOẠI</Form.Label>
                      <Form.Control 
                        type="tel" 
                        name="phone" 
                        placeholder="09xxxxxxxxx" 
                        className="modern-input" 
                        value={formData.phone} 
                        onChange={handleChange} 
                        isInvalid={!!phoneError} /* Bật viền đỏ nếu có lỗi */
                        required 
                      />
                      <Form.Control.Feedback type="invalid" className="small">
                          {phoneError}
                      </Form.Control.Feedback>
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small text-secondary">MẬT KHẨU</Form.Label>
                      <InputGroup>
                        <Form.Control 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Tối thiểu 6 ký tự" 
                            className="modern-input border-end-0" 
                            value={formData.password}
                            onChange={handleChange} 
                            required 
                            minLength={6}
                        />
                        <InputGroup.Text className="bg-white border-start-0 text-muted" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </InputGroup.Text>
                      </InputGroup>
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold gradient-btn" disabled={loading || !!phoneError}>
                      {loading ? "Đang gửi mã..." : "Tiếp Tục"}
                  </Button>
                </Form>
              ) : (
                <Form onSubmit={handleFinalRegister} autoComplete="off">
                   <Form.Group className="mb-4">
                      <Form.Label className="fw-bold small text-secondary text-center d-block">NHẬP MÃ OTP 6 SỐ</Form.Label>
                      <Form.Control 
                        type="text" 
                        name="otp" 
                        placeholder="123456" 
                        className="modern-input text-center fs-3 fw-bold letter-spacing-10" 
                        maxLength="6" 
                        value={formData.otp}
                        onChange={handleChange} 
                        required 
                        autoFocus
                        autoComplete="one-time-code" 
                      />
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold gradient-btn mb-3" disabled={loading || formData.otp.length !== 6}>
                      {loading ? "Đang xác thực..." : "Xác Nhận Đăng Ký"}
                  </Button>
                  <div className="text-center">
                    <Button 
                        variant="link" 
                        className="text-success text-decoration-none small" 
                        disabled={countdown > 0 || loading} 
                        onClick={handleRequestOTP}
                    >
                        {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã OTP"}
                    </Button>
                    <br/>
                    <Button variant="link" className="text-muted small text-decoration-none mt-2" onClick={() => setStep(1)}>Quay lại sửa thông tin</Button>
                  </div>
                </Form>
              )}
              
              <div className="text-center mt-4">
                  <span className="text-muted">Đã có tài khoản? </span>
                  <Link to="/login" className="text-decoration-none fw-bold text-success">Đăng nhập</Link>
              </div>
          </div>
      </div>
    </div>
  );
};

export default RegisterPage;