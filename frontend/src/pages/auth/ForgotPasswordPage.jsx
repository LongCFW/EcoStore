import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, InputGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaKey, FaEye, FaEyeSlash } from 'react-icons/fa';
import authApi from '../../services/auth.service';
import toast from 'react-hot-toast';
import '../../assets/styles/auth-profile.css';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  // Có 3 bước rõ ràng
  // 1: Nhập Email -> 2: Nhập OTP -> 3: Nhập Mật khẩu mới
  const [step, setStep] = useState(1); 
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    if (e.target.name === 'otp') {
        const re = /^[0-9\b]+$/;
        if (e.target.value === '' || re.test(e.target.value)) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    } else {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    if (error) setError('');
  };

  // --- BƯỚC 1: GỬI EMAIL YÊU CẦU OTP ---
  const handleRequestOTP = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.sendOtp({ email: formData.email, type: 'reset' });
      toast.success("Mã khôi phục đã được gửi!");
      setStep(2); // Chuyển sang bước nhập OTP
      setCountdown(60);
    } catch (err) {
      setError(err.response?.data?.message || "Email không tồn tại trong hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  // --- BƯỚC 2: XÁC NHẬN OTP MÀ KHÔNG GỌI API (Chỉ để chuyển bước 3) ---
  const handleVerifyOTPLocal = (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6) {
        setError("Vui lòng nhập đủ 6 số OTP.");
        return;
    }
    setError('');
    // Chuyển thẳng sang bước 3 (Đổi mật khẩu) gộp check OTP và đổi pass thành 1 API call ở Bước 3.
    setStep(3); 
  };

  // --- BƯỚC 3: GỬI YÊU CẦU ĐỔI MẬT KHẨU (Gồm cả Email, OTP và Pass Mới) ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
        setError("Mật khẩu phải từ 6 ký tự trở lên.");
        return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
        setError("Mật khẩu xác nhận không khớp.");
        return;
    }

    setLoading(true);
    try {
        await authApi.resetPassword({ 
            email: formData.email, 
            otp: formData.otp, 
            newPassword: formData.newPassword 
        });
        toast.success("Đổi mật khẩu thành công!");
        navigate('/login');
    } catch (err) {
        setError(err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.");
        if (err.response?.status === 400) {
            setStep(2); // Bị sai OTP thì đẩy ngược về màn hình 2 bắt nhập lại
        }
    } finally {
        setLoading(false);
    }
  };

  // Xử lý tiêu đề theo từng bước
  const getTitle = () => {
      if (step === 1) return "Quên Mật Khẩu?";
      if (step === 2) return "Xác Nhận OTP";
      return "Mật Khẩu Mới";
  }
  const getSubTitle = () => {
      if (step === 1) return "Nhập email bạn đã đăng ký để nhận mã khôi phục.";
      if (step === 2) return `Mã xác thực đã được gửi đến ${formData.email}`;
      return "Vui lòng thiết lập mật khẩu mới bảo mật hơn.";
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-banner-side" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=1200&q=80")'}}>
          <div className="auth-banner-overlay"></div>
          <div className="auth-banner-content text-center">
              <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
                  <FaKey size={40} className="text-warning"/>
              </div>
              <h1 className="display-4 fw-bold mb-3 text-white">Khôi Phục</h1>
              <p className="fs-5 opacity-90 text-white">Lấy lại quyền truy cập tài khoản của bạn.</p>
          </div>
      </div>

      <div className="auth-form-side">
          <Link to="/login" className="back-home-btn"><FaArrowLeft/> Quay lại đăng nhập</Link>
          <div className="auth-form-container">
              <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-2">{getTitle()}</h2>
                  <p className="text-muted">{getSubTitle()}</p>
              </div>

              {error && <Alert variant="danger" className="text-center py-2 small">{error}</Alert>}

              {/* BƯỚC 1: FORM NHẬP EMAIL */}
              {step === 1 && (
                  <Form onSubmit={handleRequestOTP}>
                      <Form.Group className="mb-4">
                          <Form.Label className="fw-bold small text-secondary">EMAIL ĐÃ ĐĂNG KÝ</Form.Label>
                          <Form.Control type="email" name="email" placeholder="name@example.com" className="modern-input" value={formData.email} onChange={handleChange} required/>
                      </Form.Group>
                      <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold gradient-btn" disabled={loading || !formData.email}>
                          {loading ? "Đang xử lý..." : "Gửi Mã Khôi Phục"}
                      </Button>
                  </Form>
              )}

              {/* BƯỚC 2: FORM NHẬP OTP */}
              {step === 2 && (
                   <Form onSubmit={handleVerifyOTPLocal} autoComplete="off">
                      <Form.Group className="mb-4">
                         <Form.Label className="fw-bold small text-secondary text-center d-block">NHẬP MÃ OTP 6 SỐ</Form.Label>
                         <Form.Control 
                           type="text" name="otp" placeholder="123456" 
                           className="modern-input text-center fs-3 fw-bold letter-spacing-10" 
                           maxLength="6" value={formData.otp} onChange={handleChange} required autoFocus
                           autoComplete="one-time-code"
                         />
                     </Form.Group>
                     <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold gradient-btn mb-3" disabled={formData.otp.length !== 6}>
                         Tiếp tục
                     </Button>
                     <div className="text-center mt-3">
                       <Button variant="link" className="text-success text-decoration-none small" disabled={countdown > 0 || loading} onClick={handleRequestOTP}>
                           {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : "Gửi lại mã OTP"}
                       </Button>
                     </div>
                 </Form>
              )}

              {/* BƯỚC 3: FORM NHẬP MẬT KHẨU MỚI */}
              {step === 3 && (
                  <Form onSubmit={handleResetPassword}>
                      <Form.Group className="mb-3">
                          <Form.Label className="fw-bold small text-secondary">MẬT KHẨU MỚI</Form.Label>
                          <InputGroup>
                            <Form.Control type={showPassword ? "text" : "password"} name="newPassword" placeholder="••••••••" className="modern-input border-end-0" value={formData.newPassword} onChange={handleChange} required minLength={6}/>
                            <InputGroup.Text className="bg-white border-start-0 text-muted" onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </InputGroup.Text>
                          </InputGroup>
                      </Form.Group>
                      <Form.Group className="mb-4">
                          <Form.Label className="fw-bold small text-secondary">XÁC NHẬN MẬT KHẨU</Form.Label>
                          <Form.Control type="password" name="confirmPassword" placeholder="••••••••" className="modern-input" value={formData.confirmPassword} onChange={handleChange} required/>
                      </Form.Group>
                      <Button variant="success" type="submit" className="w-100 py-3 rounded-pill fw-bold gradient-btn" disabled={loading}>
                          {loading ? "Đang cập nhật..." : "Đổi Mật Khẩu"}
                      </Button>
                  </Form>
              )}

          </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;