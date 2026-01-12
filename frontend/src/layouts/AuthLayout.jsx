import React from "react";
import { Outlet, Link } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

const AuthLayout = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <Container style={{ maxWidth: "500px" }}>
        {/* Logo click về trang chủ */}
        <div className="text-center mb-4">
          <Link
            to="/"
            className="text-decoration-none text-success fw-bold fs-2"
          >
            EcoStore
          </Link>
        </div>

        {/* Card chứa Form */}
        <Card className="shadow-lg border-0 rounded-4">
          <Card.Body className="p-5">
            <Outlet />
          </Card.Body>
        </Card>

        {/* Footer nhỏ */}
        <div className="text-center mt-4 text-muted small">
          © 2025 EcoStore. Bảo mật & Điều khoản.
        </div>
      </Container>
    </div>
  );
};

export default AuthLayout;
