import { useCart } from "../context/CartContext";

const MACRO_DATABASE = {
  "Masala Dosa": { calories: 350, protein: 6, carbs: 45 },
  "Ghee Karam Dosa": { calories: 420, protein: 7, carbs: 45 },
  "Idli (2 pcs)": { calories: 150, protein: 4, carbs: 30 },
  "Poori Curry": { calories: 380, protein: 6, carbs: 50 },
  "Paneer Roll": { calories: 450, protein: 18, carbs: 40 },
  "Veg Fried Rice": { calories: 400, protein: 7, carbs: 60 },
  "Chicken Fried Rice": { calories: 520, protein: 24, carbs: 65 },
  "Mango Juice": { calories: 120, protein: 1, carbs: 28 },
  "Watermelon Juice": { calories: 90, protein: 1, carbs: 22 },
  "Mosambi Juice": { calories: 110, protein: 1, carbs: 26 },
  "Badam Milk": { calories: 180, protein: 6, carbs: 24 },
  "Dosa + Mango Juice": { calories: 470, protein: 7, carbs: 73 },
  "Idli + Badam Milk": { calories: 330, protein: 10, carbs: 54 },
  "Gulab Jamun": { calories: 300, protein: 4, carbs: 55 },
  "Double Ka Meetha": { calories: 350, protein: 5, carbs: 60 },
  "Secret Spicy Dosa": { calories: 380, protein: 7, carbs: 46 }
};

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

  const getMacros = (itemName) => {
    const cleanName = Object.keys(MACRO_DATABASE).find(k => itemName.toLowerCase().includes(k.toLowerCase()));
    return cleanName ? MACRO_DATABASE[cleanName] : { calories: 250, protein: 5, carbs: 35 };
  };

  const macros = cartItems.reduce((acc, item) => {
    const info = getMacros(item.name);
    return {
      calories: acc.calories + info.calories * item.quantity,
      protein: acc.protein + info.protein * item.quantity,
      carbs: acc.carbs + info.carbs * item.quantity,
    };
  }, { calories: 0, protein: 0, carbs: 0 });

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

            {/* Nutrition & Macro Estimator Card */}
            <div className="mt-6 border-2 border-black p-4 bg-[#f7f3ee] text-xs font-bold space-y-2 shadow-[2px_2px_0px_black] text-black text-left">
              <p className="font-black text-sm text-black mb-2 flex items-center gap-1">📊 NUTRITION ESTIMATOR</p>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span>Calories:</span>
                <span className="font-black">{macros.calories} kcal</span>
              </div>
              <div className="flex justify-between border-b border-black/10 pb-1">
                <span>Protein:</span>
                <span className="font-black text-green-600">{macros.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs:</span>
                <span className="font-black text-orange-600">{macros.carbs}g</span>
              </div>
              <p className="text-[9px] text-gray-500 font-medium pt-1 italic">*Estimates based on standard preparation size.</p>
            </div>

            <div className="mt-8">
              <h3 className="text-2xl font-black text-black text-left">Total: ₹{total}</h3>

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