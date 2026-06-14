import { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function FeaturedItems() {
  const [items, setItems] = useState([]);
  const { addToCart, decreaseQuantity, getQuantity } = useCart();

  useEffect(() => {
    loadFeatured();
  }, []);

  const loadFeatured = async () => {
    try {
      const res = await api.get("/menu/featured");
      setItems(res.data);
    } catch (error) {
      console.error("Featured loading error:", error);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl?.startsWith("/uploads")) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
    return imageUrl;
  };

  if (items.length === 0) return null;

  return (
    <section className="py-24 bg-[#f7f3ee]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="uppercase tracking-[4px] text-red-500 mb-2 font-bold">
          Today's Heat
        </p>

        <h2 className="text-5xl md:text-6xl font-black mb-12">
          CHEF'S PICKS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => {
            const quantity = getQuantity(item.id);

            return (
              <div
                key={item.id}
                className="bg-white border-2 border-black shadow-[8px_8px_0px_#000]"
              >
                <img
                  src={getImageUrl(item.image_url)}
                  alt={item.name}
                  className="h-80 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="text-3xl font-bold mb-3">{item.name}</h3>

                  <p className="text-red-500 text-4xl font-black">
                    ₹{item.price}
                  </p>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className={`mt-6 px-8 py-4 font-bold ${
                        item.available
                          ? "bg-black text-white hover:bg-red-500"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      {item.available ? "+ ADD" : "SOLD OUT"}
                    </button>
                  ) : (
                    <div className="mt-6 flex items-center justify-between border-2 border-black">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-16 py-4 bg-red-500 text-white text-2xl font-black"
                      >
                        -
                      </button>

                      <span className="text-2xl font-black">{quantity}</span>

                      <button
                        onClick={() => addToCart(item)}
                        className="w-16 py-4 bg-black text-white text-2xl font-black"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}