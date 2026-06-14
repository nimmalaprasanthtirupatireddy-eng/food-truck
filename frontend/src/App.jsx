import { useState, useEffect, useRef } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedItems from "./components/FeaturedItems";
import MenuSection from "./components/MenuSection";
import CartModal from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrderSuccessModal from "./components/OrderSuccessModal";
import Footer from "./components/Footer";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TrackOrder from "./pages/TrackOrder";
import api from "./services/api";
import { useCart } from "./context/CartContext";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedItems />
      <MenuSection />
      <Footer />
      <CartModal />
      <CheckoutModal />
      <OrderSuccessModal />
    </>
  );
}

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));

  useEffect(() => {
    const checkToken = async () => {
      if (!token) return;
      try {
        await api.get("/admin/test-auth");
      } catch (err) {
        console.error("Session expired or invalid, logging out...", err);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        setToken(null);
      }
    };
    checkToken();
  }, [token]);

  return token ? (
    <AdminDashboard onLogout={() => setToken(null)} />
  ) : (
    <AdminLogin onLogin={() => setToken(localStorage.getItem("adminToken"))} />
  );
}

function App() {
  const { heatLevel } = useCart();
  const themeClass = heatLevel === "Mild" ? "theme-mild" :
                     heatLevel === "Medium" ? "theme-medium" :
                     heatLevel === "Hot" ? "theme-hot" : "theme-elfuego";

  const activeClasses = `bg-[#f7f3ee] min-h-screen ${themeClass}`;

  return (
    <BrowserRouter>
      <div className={activeClasses}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;