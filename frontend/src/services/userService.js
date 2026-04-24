import api from "./api"; // ✅ use configured instance

// 🔥 GET USERS
export const getUsers = async () => {
  try {
    const res = await api.get("/users"); // ✅ token attached

    // ensure always array
    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
};