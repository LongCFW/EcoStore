import React, { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import authApi from "../../services/auth.service";
import {
  FaArrowLeft,
  FaGoogle,
  FaFacebookF,
  FaLeaf,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import "../../assets/styles/auth-profile.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // Bật/tắt pass
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await authApi.login(formData);
      if (response.success) {
        const { token, user } = response.data;
        login(user, token, rememberMe);
        if (["admin", "manager", "staff"].includes(user.role)) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div
        className="auth-banner-side"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80")',
        }}
      >
        <div className="auth-banner-overlay"></div>
        <div className="auth-banner-content text-center">
          <div className="bg-white p-3 rounded-circle d-inline-flex mb-4 shadow-lg animate-bounce">
            <FaLeaf size={40} className="text-success" />
          </div>
          <h1 className="display-4 fw-bold mb-3 text-white">
            Sống Xanh <br /> Cùng EcoStore
          </h1>
        </div>
      </div>

      <div className="auth-form-side">
        <Link to="/" className="back-home-btn">
          <FaArrowLeft /> Về trang chủ
        </Link>
        <div className="auth-form-container">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-dark mb-2">Chào Mừng Trở Lại!</h2>
            <p className="text-muted">Đăng nhập để tiếp tục mua sắm</p>
          </div>

          {error && (
            <Alert variant="danger" className="text-center py-2 small">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-secondary">
                EMAIL
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="name@example.com"
                className="modern-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold small text-secondary">
                MẬT KHẨU
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="modern-input border-end-0"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <InputGroup.Text
                  className="bg-white border-start-0 text-muted cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <Form.Check
                type="checkbox"
                label="Ghi nhớ đăng nhập"
                className="small text-muted"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <Link
                to="/forgot-password"
                className="text-decoration-none small text-success fw-bold"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              variant="success"
              type="submit"
              className="w-100 py-3 rounded-pill fw-bold shadow-sm mb-4 gradient-btn"
              disabled={loading}
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
            </Button>

            {/* Social & Register Links*/}
            <div className="text-center mt-4">
              <span className="text-muted">Chưa có tài khoản? </span>
              <Link
                to="/register"
                className="text-decoration-none fw-bold text-success"
              >
                Đăng ký ngay
              </Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
