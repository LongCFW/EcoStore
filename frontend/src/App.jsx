import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import ProductDetailPage from "./pages/ProductDetailPage.jsx";
import CartPage from "./pages/CartPage.jsx";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import UserProfilePage from "./pages/UserProfilePage.jsx";
import AboutPage from "./pages/AboutPage.jsx";

// Component cuộn lên đầu trang khi chuyển route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>      
      <ScrollToTop />

      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="*"
            element={
              <div className="text-center mt-5 py-5">
                <h1 className="display-1 fw-bold text-success">404</h1>
                <p className="lead">Không tìm thấy trang bạn yêu cầu.</p>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
