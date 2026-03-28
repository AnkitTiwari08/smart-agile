import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

const API = axios.create({
  baseURL: `${API_BASE}/api`,
});

export default API; // ✅ VERY IMPORTANT