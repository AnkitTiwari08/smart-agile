import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div style={nav}>
      <h2 onClick={() => navigate("/dashboard")} style={{ cursor: "pointer", color: "#6366f1" }}>
        Smart Agile
      </h2>

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={btn} onClick={() => navigate("/dashboard")}>Dashboard</button>
        <button style={btn} onClick={() => navigate("/projects")}>Projects</button>
        <button style={logoutBtn} onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

const nav = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 30px",
  background: "#020617",
  color: "#fff",
};

const btn = {
  background: "#1e293b",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

const logoutBtn = {
  background: "red",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "6px",
  cursor: "pointer",
};

export default Navbar;