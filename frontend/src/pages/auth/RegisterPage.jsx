import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }
    console.log("Register data:", formData);
    // Giả lập đăng ký xong -> chuyển sang login
    navigate("/login");
  };

  return (
    <>
      <h3 className="fw-bold mb-3 text-center">Tạo Tài Khoản</h3>
      <p className="text-muted text-center mb-4">
        Tham gia cộng đồng EcoStore ngay hôm nay.
      </p>

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Họ và tên</Form.Label>
          <Form.Control
            type="text"
            name="name"
            placeholder="Ví dụ: Nguyễn Văn A"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

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
            placeholder="Tối thiểu 6 ký tự"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4" controlId="confirmPassword">
          <Form.Label>Xác nhận mật khẩu</Form.Label>
          <Form.Control
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Button
          variant="success"
          type="submit"
          className="w-100 py-2 fw-bold mb-3"
        >
          Đăng Ký
        </Button>

        <div className="text-center">
          <span className="text-muted">Đã có tài khoản? </span>
          <Link to="/login" className="text-decoration-none fw-bold">
            Đăng nhập
          </Link>
        </div>
      </Form>
    </>
  );
};

export default RegisterPage;
