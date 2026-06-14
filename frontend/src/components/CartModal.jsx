import { useCart } from "../context/CartContext";

export default function CartModal() {
  const {
    cartItems,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    total,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50">
      <div className="absolute right-0 top-0 h-full w-full sm:w-[430px] bg-white p-6 overflow-y-auto border-l-4 border-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-black">YOUR ORDER</h2>

          <button onClick={() => setIsCartOpen(false)} className="text-2xl">
            ✕
          </button>
        </div>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div key={item.id} className="border-b-2 border-black py-4">
                <div className="flex gap-4">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover border border-black"
                  />

                  <div className="flex-1">
                    <h3 className="font-black">{item.name}</h3>

                    <p className="text-red-500 font-bold">
                      ₹{item.price * item.quantity}
                    </p>

                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="bg-red-500 text-white px-3 py-1 font-black"
                      >
                        -
                      </button>

                      <span className="font-black">{item.quantity}</span>

                      <button
                        onClick={() => addToCart(item)}
                        className="bg-black text-white px-3 py-1 font-black"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 ml-auto font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-8">
              <h3 className="text-2xl font-black">Total: ₹{total}</h3>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                className="w-full mt-4 bg-red-500 text-white py-4 font-black border-2 border-black shadow-[4px_4px_0px_black]"
              >
                PLACE ORDER
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}