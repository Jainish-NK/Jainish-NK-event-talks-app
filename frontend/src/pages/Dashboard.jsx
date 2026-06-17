import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experiences: 0, messages: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projects, skills, experiences, messages] = await Promise.all([
          api.projects.getAll(),
          api.skills.getAll(),
          api.experiences.getAll(),
          api.messages.getAll(),
        ]);

        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          messages: messages.length,
        });

        // Get 3 most recent messages
        const sortedMessages = [...messages].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentMessages(sortedMessages.slice(0, 3));
      } catch (err) {
        showToast("Error retrieving CMS statistics from server.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout title="CMS Dashboard">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {loading ? (
        <div style={{ color: "var(--text-secondary)" }}>Loading Dashboard Data...</div>
      ) : (
        <>
          {/* Quick stats grid */}
          <div className="admin-stats-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-label">Total Projects</span>
              <span className="admin-stat-val">{stats.projects}</span>
              <Link to="/admin/projects" style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.4rem" }}>
                Manage Projects →
              </Link>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Skill Catalog</span>
              <span className="admin-stat-val">{stats.skills}</span>
              <Link to="/admin/skills" style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.4rem" }}>
                Manage Skills →
              </Link>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-label">Timeline Milestones</span>
              <span className="admin-stat-val">{stats.experiences}</span>
              <Link to="/admin/experiences" style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.4rem" }}>
                Manage Timeline →
              </Link>
            </div>
            <div className="admin-stat-card" style={{ border: stats.messages > 0 ? "1px solid rgba(6, 182, 212, 0.2)" : "1px solid var(--border)" }}>
              <span className="admin-stat-label">Inbox Messages</span>
              <span className="admin-stat-val" style={{ color: stats.messages > 0 ? "var(--primary)" : "inherit" }}>
                {stats.messages}
              </span>
              <Link to="/admin/messages" style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: "0.4rem" }}>
                View Inbox →
              </Link>
            </div>
          </div>

          {/* Recent messages block */}
          <div className="admin-content-box">
            <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
              Recent Contact Inquiries
            </h2>
            {recentMessages.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                Your inbox is currently empty.
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    style={{
                      border: "1px solid var(--border)",
                      borderRadius: "10px",
                      padding: "1.2rem",
                      backgroundColor: "rgba(255, 255, 255, 0.01)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.6rem" }}>
                      <div>
                        <strong style={{ color: "var(--text-primary)" }}>{msg.name}</strong>{" "}
                        <span style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                          ({msg.email})
                        </span>
                      </div>
                      <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: "600", marginBottom: "0.4rem" }}>
                      Subject: {msg.subject}
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                      "{msg.message}"
                    </p>
                  </div>
                ))}
                <div style={{ marginTop: "0.5rem" }}>
                  <Link to="/admin/messages" className="btn-secondary">
                    View All Messages
                  </Link>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </AdminLayout>
  );
}
