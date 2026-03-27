import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        color: "#fff",
        fontFamily: "Arial",
      }}
    >
      {/* 🔷 NAVBAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 40px",
          alignItems: "center",
        }}
      >
        <h2 style={{ color: "#6366f1" }}>Smart Agile</h2>

        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={() => navigate("/login")}
            style={btnOutline}
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            style={btnPrimary}
          >
            Register
          </button>
        </div>
      </div>

      {/* 🔷 HERO */}
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          padding: "0 20px",
        }}
      >
        <h1 style={{ fontSize: "48px", marginBottom: "20px" }}>
          Manage Your Projects Smartly 🚀
        </h1>

        <p style={{ fontSize: "18px", color: "#ccc" }}>
          Track tasks, assign work, and manage Agile workflows easily
        </p>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => navigate("/register")}
            style={btnPrimary}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* 🔷 FEATURES */}
      <div
        style={{
          marginTop: "120px",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}
      >
        {[
          "Kanban Board",
          "Task Assignment",
          "Real-time Tracking",
        ].map((feature, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: "30px",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <h3>{feature}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

const btnPrimary = {
  background: "#6366f1",
  color: "#fff",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

const btnOutline = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default LandingPage;