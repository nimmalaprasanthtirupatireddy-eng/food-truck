export default function Hero() {
  return (
    <section
      className="h-[80vh] bg-cover bg-center relative"
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

        <button
            onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
            className="mt-10 bg-red-500 text-white px-10 py-4 border border-black shadow-[5px_5px_0px_black] font-bold"
        >
            ORDER NOW →
        </button>
      </div>
    </section>
  );
}