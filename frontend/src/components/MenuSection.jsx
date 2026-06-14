import { useEffect, useState } from "react";
import api from "../services/api";
import { useCart } from "../context/CartContext";

export default function MenuSection() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const { addToCart, decreaseQuantity, getQuantity } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const res = await api.get("/menu/");
      setItems(res.data);
    } catch (error) {
      console.error("Menu loading error:", error);
    }
  };

  const getImageUrl = (imageUrl) => {
    if (imageUrl?.startsWith("/uploads")) {
      return `http://127.0.0.1:8000${imageUrl}`;
    }
    return imageUrl;
  };

  const filtered = items.filter((item) => {
    const matchesCategory =
      category === "All" ||
      item.category.toLowerCase() === category.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="menu" className="py-20 bg-[#f7f3ee]">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <p className="text-red-500 uppercase tracking-[4px] font-bold">
          The Menu
        </p>

        <h2 className="text-5xl md:text-6xl font-black mb-10">
          EVERYTHING WE COOK
        </h2>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search dosa, juice, rice..."
          className="w-full mb-8 border-2 border-black p-4 text-xl font-bold bg-white"
        />

        <div className="flex flex-wrap gap-4 mb-10">
          {["All", "Food", "Juices", "Combos", "Desserts"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-3 border border-black font-bold ${
                category === cat
                  ? "bg-black text-white shadow-[4px_4px_0px_#ef3349]"
                  : "bg-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white border-2 border-black p-8 text-center font-black text-2xl">
            No items found.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => {
            const quantity = getQuantity(item.id);

            return (
              <div
                key={item.id}
                className={`bg-white border-2 border-black shadow-[6px_6px_0px_black] ${
                  !item.available ? "opacity-50" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(item.image_url)}
                    alt={item.name}
                    className="h-72 w-full object-cover"
                  />

                  {!item.available && (
                    <span className="absolute top-4 left-4 bg-gray-700 text-white px-3 py-1 font-bold">
                      SOLD OUT
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between gap-4">
                    <h3 className="text-2xl font-black">{item.name}</h3>

                    <span className="text-red-500 font-black text-2xl">
                      ₹{item.price}
                    </span>
                  </div>

                  <p className="mt-4 text-gray-600 min-h-[50px]">
                    {item.description}
                  </p>

                  {quantity === 0 ? (
                    <button
                      onClick={() => addToCart(item)}
                      disabled={!item.available}
                      className={`mt-6 w-full py-4 font-bold ${
                        item.available
                          ? "bg-black text-white hover:bg-red-500"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      {item.available ? "+ ADD TO ORDER" : "SOLD OUT"}
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