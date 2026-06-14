import axios from "axios";

const api = axios.create({
  baseURL: "https://food-truck-nlj7.onrender.com",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;