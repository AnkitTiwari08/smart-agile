import api from "./api";

// GET ALL PROJECTS
export const getProjects = async () => {
  const res = await api.get("/projects");
  return res.data;
};

// CREATE PROJECT
export const createProject = async (data) => {
  const res = await api.post("/projects", data);
  return res.data;
};

// DELETE PROJECT
export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

// ✅ UPDATE PROJECT (EDIT)
export const updateProject = async (id, data) => {
  const res = await api.put(`/projects/${id}`, data);
  return res.data;
};