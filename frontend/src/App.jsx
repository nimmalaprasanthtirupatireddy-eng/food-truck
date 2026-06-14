import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedItems from "./components/FeaturedItems";
import MenuSection from "./components/MenuSection";
import CartModal from "./components/CartModal";
import CheckoutModal from "./components/CheckoutModal";
import OrderSuccessModal from "./components/OrderSuccessModal";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import TrackOrder from "./pages/TrackOrder";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedItems />
      <MenuSection />
      <CartModal />
      <CheckoutModal />
      <OrderSuccessModal />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="bg-[#f7f3ee] min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/track" element={<TrackOrder />} />
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;