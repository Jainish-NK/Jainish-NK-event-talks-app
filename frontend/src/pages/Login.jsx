import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Please enter both username and password.", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await api.auth.login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Access authorized! Redirecting to CMS panel...");
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      showToast(err.message || "Invalid credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="hero-glow-1"></div>

      <div
        className="contact-form"
        style={{
          width: "100%",
          maxWidth: "400px",
          margin: "0 1.5rem",
          boxShadow: "var(--shadow-lg), var(--shadow-glow)",
          border: "1px solid var(--border-hover)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h2 className="section-title" style={{ fontSize: "1.8rem", marginBottom: "0.4rem" }}>
            CMS Console
          </h2>
          <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
            Authenticate to modify portfolio information
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
          <div className="form-input-wrapper">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoFocus
              required
            />
          </div>

          <div className="form-input-wrapper">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: "0.5rem" }} disabled={loading}>
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.2rem", fontSize: "0.78rem", color: "var(--text-muted)" }}>
          <a href="/" style={{ color: "var(--primary)" }}>
            ← Return to public site
          </a>
        </div>
      </div>
    </div>
  );
}
