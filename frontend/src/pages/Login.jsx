import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // 🔥 VALIDATION FUNCTION
  const validate = () => {
    let newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const res = await login(formData);

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      navigate("/dashboard");
    } catch (err) {
      setErrors({
        api: err?.response?.data?.message || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginBottom: "10px" }}>Welcome Back 👋</h1>
        <p style={{ color: "#aaa", marginBottom: "20px" }}>
          Login to Smart Agile
        </p>

        {/* 🔥 API ERROR */}
        {errors.api && (
          <p style={{ color: "red", marginBottom: "10px" }}>
            {errors.api}
          </p>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          
          {/* EMAIL */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.email && (
              <p style={errorText}>{errors.email}</p>
            )}
          </div>

          {/* PASSWORD */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
              style={inputStyle}
            />
            {errors.password && (
              <p style={errorText}>{errors.password}</p>
            )}
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ marginTop: "20px", color: "#ccc" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={{ color: "#6366f1" }}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

// 🎨 STYLES

const wrapperStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #0f172a, #1e293b)",
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  backdropFilter: "blur(10px)",
  padding: "40px",
  borderRadius: "12px",
  width: "350px",
  color: "#fff",
  textAlign: "center",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
};

const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #444",
  outline: "none",
  width: "100%",
};

const buttonStyle = {
  background: "#6366f1",
  color: "#fff",
  padding: "12px",
  borderRadius: "8px",
  border: "none",
};

const errorText = {
  color: "red",
  fontSize: "12px",
  marginTop: "5px",
  textAlign: "left",
};

export default Login;