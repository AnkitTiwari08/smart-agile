import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/issues`;

// GET ISSUES
export const getIssuesByProject = async (projectId) => {
  const res = await axios.get(`${API}?project=${projectId}`);
  return res.data;
};

// CREATE
export const createIssue = async (data) => {
  const res = await axios.post(API, data);
  return res.data;
};

// DELETE
export const deleteIssue = async (id) => {
  const res = await axios.delete(`${API}/${id}`);
  return res.data;
};

// UPDATE STATUS
export const updateIssueStatus = async (id, status) => {
  const res = await axios.put(`${API}/${id}/status`, { status });
  return res.data;
};

// UPDATE ISSUE
export const updateIssue = async (id, data) => {
  const res = await axios.put(`${API}/${id}`, data);
  return res.data;
};

// ASSIGN USER
export const assignUser = async (issueId, userId) => {
  const res = await axios.put(`${API}/${issueId}/assign`, {
    userId,
  });
  return res.data;
};

// 🔥 FIX: ADD THIS
export const getIssueStats = async () => {
  const res = await axios.get(`${API}/stats`);
  return res.data;
};