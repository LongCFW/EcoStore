import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../components/common/Header'; // Import Header mới
import Footer from '../components/common/Footer';

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
      <Footer />
    </div>
  );
};

export default MainLayout;