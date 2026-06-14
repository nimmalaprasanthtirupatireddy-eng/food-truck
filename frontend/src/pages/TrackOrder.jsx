import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function TrackOrder() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [order, setOrder] = useState(null);

  const track = async (e) => {
    e.preventDefault();

    try {
      const res = await api.get(`/orders/track/${code}`);
      setOrder(res.data);
    } catch {
      alert("Order not found");
      setOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] px-6 py-10">
      <button onClick={() => navigate("/")} className="font-black mb-8">
        ← BACK TO MENU
      </button>

      <div className="max-w-xl mx-auto bg-white border-4 border-black shadow-[8px_8px_0px_#ef3349] p-8">
        <h1 className="text-5xl font-black mb-6">TRACK ORDER</h1>

        <form onSubmit={track} className="flex gap-3 mb-8">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter order code"
            className="flex-1 border-2 border-black p-4 font-bold uppercase"
          />

          <button className="bg-black text-white px-6 font-black">
            TRACK
          </button>
        </form>

        {order && (
          <div className="border-2 border-black p-5">
            <p className="font-black">ORDER CODE</p>
            <h2 className="text-3xl font-black mb-4">{order.order_code}</h2>

            <p className="font-black">STATUS</p>
            <h2 className="text-4xl font-black text-red-500 mb-4">
              {order.status}
            </h2>

            <p className="font-black">TOTAL</p>
            <p className="text-2xl font-black mb-4">₹{order.total_amount}</p>

            <p className="font-black mb-2">ITEMS</p>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between border-b py-2">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}