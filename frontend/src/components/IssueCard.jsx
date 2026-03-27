import { useState, useEffect } from "react";
import { updateIssue, assignUser } from "../services/issueService";
import { getUsers } from "../services/userService";

const IssueCard = ({ issue, onDelete, refresh }) => {
  const [editing, setEditing] = useState(false);
  const [users, setUsers] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "medium",
  });

  useEffect(() => {
    if (issue) {
      setForm({
        title: issue.title || "",
        description: issue.description || "",
        priority: issue.priority || "medium",
      });
    }
  }, [issue]);

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : []);
    };
    fetchUsers();
  }, []);

  const handleAssign = async (userId) => {
    if (!userId) return;
    await assignUser(issue._id, userId);
    refresh && refresh();
  };

  const priorityColor = {
    low: "#22c55e",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div style={card}>
      <h3 style={title}>{issue.title}</h3>

      <p style={desc}>{issue.description}</p>

      {/* TAGS */}
      <div style={tagRow}>
        <span
          style={{
            ...badge,
            background: priorityColor[issue.priority],
          }}
        >
          {issue.priority}
        </span>

        <span style={statusBadge(issue.status)}>
          {issue.status}
        </span>
      </div>

      {/* ASSIGN */}
      <select
        style={select}
        onChange={(e) => handleAssign(e.target.value)}
        value={issue.assignee?._id || ""}
      >
        <option value="">Assign User</option>
        {users.map((u) => (
          <option key={u._id} value={u._id}>
            {u.name}
          </option>
        ))}
      </select>

      {/* FOOTER */}
      <div style={footer}>
        <small>
          {new Date(issue.createdAt).toLocaleDateString()}
        </small>

        <div style={btnRow}>
          <button style={editBtn} onClick={() => setEditing(true)}>
            ✏️
          </button>
          <button style={deleteBtn} onClick={() => onDelete(issue._id)}>
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

// 🎨 STYLES

const card = {
  background: "#0f172a",
  padding: "14px",
  borderRadius: "12px",
  marginBottom: "10px",
  color: "#fff",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  transition: "0.2s",
};

const title = {
  fontSize: "16px",
  fontWeight: "600",
};

const desc = {
  fontSize: "13px",
  color: "#9ca3af",
  margin: "6px 0",
};

const tagRow = {
  display: "flex",
  gap: "6px",
  marginBottom: "8px",
};

const badge = {
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  color: "#fff",
};

const statusBadge = (status) => ({
  padding: "3px 8px",
  borderRadius: "6px",
  fontSize: "11px",
  background:
    status === "todo"
      ? "#475569"
      : status === "in-progress"
      ? "#3b82f6"
      : "#22c55e",
});

const select = {
  width: "100%",
  padding: "6px",
  borderRadius: "6px",
  marginBottom: "8px",
  background: "#1e293b",
  color: "#fff",
};

const footer = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const btnRow = {
  display: "flex",
  gap: "6px",
};

const editBtn = {
  background: "#3b82f6",
  border: "none",
  padding: "5px 8px",
  borderRadius: "6px",
  color: "#fff",
};

const deleteBtn = {
  background: "#ef4444",
  border: "none",
  padding: "5px 8px",
  borderRadius: "6px",
  color: "#fff",
};

export default IssueCard;