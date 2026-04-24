import api from "./api"; // ✅ USE SAME INSTANCE

const BASE = "/issues";

// GET ISSUES
export const getIssuesByProject = async (projectId) => {
  const res = await api.get(`${BASE}?project=${projectId}`);
  return res.data;
};

// CREATE
export const createIssue = async (data) => {
  const res = await api.post(BASE, data);
  return res.data;
};

// DELETE
export const deleteIssue = async (id) => {
  const res = await api.delete(`${BASE}/${id}`);
  return res.data;
};

// UPDATE STATUS
export const updateIssueStatus = async (id, status) => {
  const res = await api.put(`${BASE}/${id}/status`, { status });
  return res.data;
};

// UPDATE ISSUE
export const updateIssue = async (id, data) => {
  const res = await api.put(`${BASE}/${id}`, data);
  return res.data;
};

// ASSIGN USER
export const assignUser = async (issueId, userId) => {
  const res = await api.put(`${BASE}/${issueId}/assign`, { userId });
  return res.data;
};

// STATS
export const getIssueStats = async () => {
  const res = await api.get(`${BASE}/stats`);
  return res.data;
};