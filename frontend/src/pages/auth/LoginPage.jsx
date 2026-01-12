import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login data:', formData);
    // Sau này sẽ gọi API login ở đây
    // Tạm thời giả lập đăng nhập thành công -> chuyển về trang chủ
    navigate('/'); 
  };

  const { login } = useAuth(); // Lấy hàm login từ context

  const handleLogin = (role) => {
    // Gọi hàm login giả lập với role mong muốn
    login(role);
    // Điều hướng dựa trên role
    if (role === 'admin' || role === 'manager' || role === 'staff') {
        navigate('/admin');
    } else {
        navigate('/');
    }
  };

  return (
    <>
     <h3 className="fw-bold mb-3 text-center">Đăng Nhập (Demo)</h3>
      <p className="text-muted text-center mb-4">Chọn quyền để test hệ thống phân quyền</p>

      <div className="d-grid gap-2 mb-3">
          <Button variant="danger" onClick={() => handleLogin('admin')}>
             Đăng nhập quyền ADMIN (Full)
          </Button>
          <Button variant="warning" onClick={() => handleLogin('manager')}>
             Đăng nhập quyền MANAGER (No Settings)
          </Button>
          <Button variant="info" onClick={() => handleLogin('staff')}>
             Đăng nhập quyền STAFF (Orders Only)
          </Button>
          <Button variant="success" onClick={() => handleLogin('customer')}>
             Đăng nhập Khách hàng (Về trang chủ)
          </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control 
            type="email" 
            name="email"
            placeholder="name@example.com" 
            value={formData.email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control 
            type="password" 
            name="password"
            placeholder="Nhập mật khẩu" 
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check type="checkbox" label="Ghi nhớ tôi" />
            <Link to="/forgot-password" className="text-decoration-none small">
                Quên mật khẩu?
            </Link>
        </div>

        <Button variant="success" type="submit" className="w-100 py-2 fw-bold mb-3">
          Đăng Nhập
        </Button>

        <div className="text-center">
            <span className="text-muted">Chưa có tài khoản? </span>
            <Link to="/register" className="text-decoration-none fw-bold">
                Đăng ký ngay
            </Link>
        </div>
      </Form>
    </>
  );
};

export default LoginPage;