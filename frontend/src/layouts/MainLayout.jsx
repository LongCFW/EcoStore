import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../components/common/Header'; // Import Header mới

const MainLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      {/* Header mới */}
      <Header />

      {/* Nội dung chính */}
      <main className="flex-grow-1 py-4">
        <Container>
           <Outlet /> 
        </Container>
      </main>

      {/* Footer (Giữ tạm hoặc tách ra file riêng sau) */}
      <footer className="bg-dark text-white text-center py-4 mt-auto">
        <Container>
          <p className="mb-0">© 2025 EcoStore. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default MainLayout;