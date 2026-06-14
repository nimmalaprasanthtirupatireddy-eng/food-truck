import { useState, useEffect } from "react";
import api from "../services/api";

export default function Hero() {
  const [crowdState, setCrowdState] = useState(null);

  useEffect(() => {
    const fetchCrowd = async () => {
      try {
        const res = await api.get("/orders/crowd-level");
        setCrowdState(res.data);
      } catch (err) {
        console.error("Crowd meter load error:", err);
      }
    };
    fetchCrowd();
  }, []);

  return (
    <section
      className="h-[85vh] bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-24 md:pt-32">
        <div className="inline-block border border-white px-4 py-2 text-white mb-8 font-bold tracking-widest">
          FIND US TODAY — 12PM TO 10PM
        </div>

        <h1 className="text-white text-5xl md:text-7xl font-black leading-none">
          STREET FOOD.
        </h1>

        <h1 className="text-orange-300 text-5xl md:text-7xl font-black leading-none">
          LOUD FLAVOR.
        </h1>

        <h1 className="text-white text-5xl md:text-7xl font-black leading-none">
          ZERO APOLOGIES.
        </h1>

        <p className="text-white text-lg md:text-xl mt-8 max-w-2xl">
          Fresh Indian street food, tiffins, juices and combos served hot from
          our truck.
        </p>

        {crowdState && (
          <div className="inline-flex flex-wrap items-center gap-2 border-2 border-black bg-white px-4 py-3 mt-8 text-black font-black shadow-[4px_4px_0px_black] text-sm md:text-base">
            <span>🚥 TRUCK CROWD METER:</span>
            <span className={`px-2 py-0.5 uppercase ${
              crowdState.color === "green" ? "bg-green-400 text-black" :
              crowdState.color === "yellow" ? "bg-yellow-400 text-black" :
              "bg-red-500 text-white animate-pulse"
            }`}>
              {crowdState.level}
            </span>
            <span className="text-gray-500 font-bold ml-1">
              (Est. Wait: {crowdState.wait_time_mins} mins)
            </span>
          </div>
        )}

        <div className="mt-8">
          <button
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="bg-red-500 text-white px-10 py-4 border border-black shadow-[5px_5px_0px_black] font-bold"
          >
              ORDER NOW →
          </button>
        </div>
      </div>
    </section>
  );
}