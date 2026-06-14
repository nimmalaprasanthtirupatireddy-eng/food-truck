import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "admin@foodtruck.com",
    password: "admin123",
  });

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/admin/login", form);

      localStorage.setItem("adminToken", res.data.access_token);
      localStorage.setItem("adminEmail", res.data.admin.email);

      navigate("/admin");
    } catch (error) {
      alert("Invalid login");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_#ef3349] p-8">
        <button
          onClick={() => navigate("/")}
          className="mb-8 font-black tracking-widest"
        >
          ← BACK TO MENU
        </button>

        <div className="text-red-500 text-4xl mb-4">🔥</div>

        <h1 className="text-5xl font-black mb-2">STAFF PORTAL</h1>
        <p className="mb-8">Sign in to run the show.</p>

        <form onSubmit={login} className="space-y-5">
          <div>
            <label className="font-black tracking-[4px]">EMAIL</label>
            <input
              className="w-full mt-2 border-2 border-black p-4"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="font-black tracking-[4px]">PASSWORD</label>
            <input
              type="password"
              className="w-full mt-2 border-2 border-black p-4"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <button className="w-full bg-black text-white py-4 font-black">
            SIGN IN →
          </button>
        </form>

        <p className="mt-6 text-sm">
          Demo: admin@foodtruck.com / admin123
        </p>
      </div>
    </div>
  );
}