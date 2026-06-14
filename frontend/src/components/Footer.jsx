export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-black py-16 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🔥</span>
            <h3 className="text-3xl font-black tracking-wide text-red-500">EL FUEGO</h3>
          </div>
          <p className="text-gray-400 font-medium">
            Spicy and bold street food flavors served hot and fresh. Catch the heat at our daily stops!
          </p>
        </div>

        <div>
          <h4 className="text-xl font-black tracking-wider mb-4 text-[#f7f3ee]">CONTACT US</h4>
          <p className="mb-2 font-medium">
            <b>Email:</b>{" "}
            <a
              href="mailto:nimmalaprasanthtirupatireddy@gmail.com"
              className="text-red-500 hover:underline break-all"
            >
              nimmalaprasanthtirupatireddy@gmail.com
            </a>
          </p>
          <p className="font-medium">
            <b>Phone:</b>{" "}
            <a href="tel:9347860966" className="text-red-500 hover:underline">
              +91 9347860966
            </a>
          </p>
        </div>

        <div>
          <h4 className="text-xl font-black tracking-wider mb-4 text-[#f7f3ee]">HOURS</h4>
          <p className="text-gray-400 font-medium mb-1">Monday - Sunday</p>
          <p className="font-bold text-lg">5:00 PM - 11:30 PM</p>
          <p className="text-xs text-red-500 mt-2">🔥 Dinner & late-night munchies!</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} El Fuego Truck. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Facebook</a>
          <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
