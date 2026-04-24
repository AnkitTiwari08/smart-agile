import api from "./api"; // ✅ use interceptor

// 🔥 GET ALL ACTIVITIES
export const getActivities = async () => {
  try {
    const res = await api.get("/activity"); // ✅ clean + token attached
    return res.data;
  } catch (err) {
    console.error("Error fetching activities:", err);
    return [];
  }
};