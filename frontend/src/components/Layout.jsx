import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const Layout = ({ children }) => {
  // Logic nút Scroll To Top toàn cục
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 300) {
        setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 300) {
        setShowScroll(false);
      }
    };
    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="d-flex flex-column min-vh-100 font-sans position-relative">
      <Header />

      <main className="flex-grow-1">{children}</main>

      <Footer />

      {/* Nút Scroll To Top Toàn Cục */}
      <div
        className={`scroll-to-top-btn ${showScroll ? "show" : ""}`}
        onClick={scrollToTop}
        title="Lên đầu trang"
      >
        <i className="bi bi-arrow-up fs-4"></i>
      </div>
    </div>
  );
};

export default Layout;
