import { useCart } from "../context/CartContext";

export default function OrderSuccessModal() {
  const { successOrder, setSuccessOrder } = useCart();

  if (!successOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg border-4 border-black shadow-[8px_8px_0px_black] p-8 text-center">
        <h2 className="text-5xl font-black text-red-500 mb-4">
          ORDER PLACED!
        </h2>

        <p className="text-xl font-bold mb-4">
          Your order has been received.
        </p>

        <div className="bg-[#f7f3ee] border-2 border-black p-5 mb-6">
          <p className="font-bold">Order Code</p>
          <p className="text-3xl font-black">{successOrder.order_code}</p>

          <p className="font-bold mt-4">Total</p>
          <p className="text-2xl font-black">₹{successOrder.total_amount}</p>

          <p className="font-bold mt-4">Status</p>
          <p className="text-xl font-black text-red-500">
            {successOrder.status}
          </p>
        </div>

        <button
          onClick={() => setSuccessOrder(null)}
          className="bg-black text-white px-8 py-4 font-black"
        >
          DONE
        </button>
      </div>
    </div>
  );
}