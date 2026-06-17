import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../utils/api";

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = api.auth.getCurrentUser();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  if (!currentUser) {
    return <div style={{ color: "white", padding: "2rem" }}>Checking credentials...</div>;
  }

  return (
    <div className="admin-layout">
      {/* Admin Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-logo">CMS Console</div>
        <ul className="admin-nav">
          <li>
            <Link to="/admin/dashboard" className={`admin-nav-link ${isActive("/admin/dashboard")}`}>
              <i className="fa-solid fa-chart-line" style={{ width: "18px" }}></i> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/projects" className={`admin-nav-link ${isActive("/admin/projects")}`}>
              <i className="fa-solid fa-code" style={{ width: "18px" }}></i> Manage Projects
            </Link>
          </li>
          <li>
            <Link to="/admin/skills" className={`admin-nav-link ${isActive("/admin/skills")}`}>
              <i className="fa-solid fa-star" style={{ width: "18px" }}></i> Manage Skills
            </Link>
          </li>
          <li>
            <Link to="/admin/experiences" className={`admin-nav-link ${isActive("/admin/experiences")}`}>
              <i className="fa-solid fa-clock-rotate-left" style={{ width: "18px" }}></i> Manage Timeline
            </Link>
          </li>
          <li>
            <Link to="/admin/messages" className={`admin-nav-link ${isActive("/admin/messages")}`}>
              <i className="fa-solid fa-envelope" style={{ width: "18px" }}></i> Contact Inbox
            </Link>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          className="btn-danger"
          style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </aside>

      {/* Admin Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1 className="admin-title">{title}</h1>
          </div>
          <div className="admin-user-info">
            Logged in as: <strong style={{ color: "var(--primary)" }}>{currentUser.name}</strong>
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ marginLeft: "1rem", fontSize: "0.8rem", padding: "6px 12px" }}>
              View Portfolio <i className="fa-solid fa-arrow-up-right-from-square" style={{ fontSize: "0.75rem" }}></i>
            </a>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
