import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/users`;

// 🔥 GET USERS (SAFE FIX)
export const getUsers = async () => {
  try {
    const res = await axios.get(API);

    // ensure always array
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};