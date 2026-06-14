import { useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function CheckoutModal() {
  const {
    cartItems,
    total,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setSuccessOrder,
    clearCart,
  } = useCart();

  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    pickup_time: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isCheckoutOpen) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (!form.customer_name || !form.phone) {
      alert("Name and phone are required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...form,
        items: cartItems.map((item) => ({
          menu_item_id: item.id,
          quantity: item.quantity,
        })),
      };

      const res = await api.post("/orders/", payload);

      setSuccessOrder(res.data);
      clearCart();
      setIsCheckoutOpen(false);
    } catch (error) {
      console.error(error);
      alert("Order failed. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-xl border-4 border-black shadow-[8px_8px_0px_black] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-black">CHECKOUT</h2>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="text-2xl font-black"
          >
            ✕
          </button>
        </div>

        <form onSubmit={placeOrder} className="space-y-4">
          <input
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full border-2 border-black p-4 font-bold"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border-2 border-black p-4 font-bold"
          />

          <input
            name="pickup_time"
            value={form.pickup_time}
            onChange={handleChange}
            placeholder="Pickup Time e.g. 7:30 PM"
            className="w-full border-2 border-black p-4 font-bold"
          />

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Notes e.g. extra chutney"
            className="w-full border-2 border-black p-4 font-bold"
          />

          <div className="bg-[#f7f3ee] border-2 border-black p-4">
            <p className="font-black text-xl">Total: ₹{total}</p>
          </div>

          <button
            disabled={loading}
            className="w-full bg-red-500 text-white py-4 font-black border-2 border-black shadow-[4px_4px_0px_black]"
          >
            {loading ? "PLACING ORDER..." : "CONFIRM ORDER"}
          </button>
        </form>
      </div>
    </div>
  );
}