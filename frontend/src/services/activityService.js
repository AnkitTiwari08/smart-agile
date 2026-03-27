import axios from "axios";

const API = "http://localhost:5000/api/activity";

// 🔥 GET ALL ACTIVITIES
export const getActivities = async () => {
  try {
    const res = await axios.get(API);
    return res.data;
  } catch (err) {
    console.error("Error fetching activities:", err);
    return [];
  }
};