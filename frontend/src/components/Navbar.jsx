import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const navigate = useNavigate();
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav className="bg-[#f7f3ee] border-b border-black sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <span className="text-red-500 text-3xl">🔥</span>
          <h1 className="text-2xl md:text-3xl font-black">EL FUEGO TRUCK</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-black text-white px-6 md:px-8 py-3 border border-black shadow-[4px_4px_0px_#ef3349] font-bold"
          >
            CART ({cartCount})
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="bg-white px-6 md:px-8 py-3 border border-black font-bold"
          >
            STAFF
          </button>
          <button
            onClick={() => navigate("/track")}
            className="bg-white px-6 md:px-8 py-3 border border-black font-bold"
          >
            TRACK
          </button>
        </div>
      </div>
    </nav>
  );
}