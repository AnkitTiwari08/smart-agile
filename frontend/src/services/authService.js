import API from "./api";

// REGISTER
export const register = async (data) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

// LOGIN
export const login = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// GET USERS
export const getUsers = async () => {
  const res = await API.get("/auth/users");
  return res.data;
};