import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});
// 🔥 ADD THIS
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log("👉 SENDING TOKEN:", token);

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;