import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadMessages = async () => {
    try {
      const data = await api.messages.getAll();
      // Sort newest first
      const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setMessages(sorted);
    } catch (err) {
      showToast("Failed to retrieve messages from server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message permanently?")) return;

    try {
      await api.messages.delete(id);
      showToast("Message deleted successfully.");
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (err) {
      showToast(err.message || "Failed to delete message.", "error");
    }
  };

  return (
    <AdminLayout title="Recruiter Message Inbox">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="admin-content-box">
        <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
          Inquiries Inbox ({messages.length})
        </h2>

        {loading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading Messages...</p>
        ) : messages.length === 0 ? (
          <p style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
            No messages have been submitted through the contact form yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            {messages.map((msg) => (
              <div
                key={msg._id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  padding: "1.5rem",
                  backgroundColor: "rgba(255, 255, 255, 0.015)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1.5rem",
                  transition: "all var(--transition-fast)",
                }}
                className="message-item-card"
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--text-primary)" }}>{msg.name}</h3>
                    <a
                      href={`mailto:${msg.email}`}
                      style={{ fontSize: "0.85rem", color: "var(--primary)", textDecoration: "underline" }}
                    >
                      {msg.email}
                    </a>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginLeft: "auto" }}>
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", marginBottom: "0.6rem" }}>
                    Subject: <span style={{ color: "var(--text-secondary)", fontWeight: "normal" }}>{msg.subject}</span>
                  </div>

                  <div
                    style={{
                      fontSize: "0.9rem",
                      color: "var(--text-secondary)",
                      lineHeight: "1.6",
                      backgroundColor: "rgba(0, 0, 0, 0.2)",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(255, 255, 255, 0.02)",
                    }}
                  >
                    {msg.message}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteClick(msg._id)}
                  className="btn-danger"
                  style={{ fontSize: "0.78rem", padding: "6px 12px", display: "flex", alignItems: "center", gap: "0.4rem" }}
                  title="Delete message permanently"
                >
                  <i className="fa-regular fa-trash-can"></i> Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
