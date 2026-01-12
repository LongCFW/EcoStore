import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from "react-bootstrap";

const MainLayout = () => {
  return (
    <>
      {/* Header tạm thời dùng Navbar của Bootstrap */}
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="/">EcoStore</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/cart">Cart</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* Outlet là nơi nội dung của các trang con (Home, Product...) sẽ hiển thị */}
      <main className="py-4">
        <Container>
          <Outlet />
        </Container>
      </main>

      {/* Footer tạm thời */}
      <footer className="bg-light text-center py-3 mt-auto border-top">
        <Container>
          <p>© 2025 EcoStore. All rights reserved.</p>
        </Container>
      </footer>
    </>
  );
};

export default MainLayout;
