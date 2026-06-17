import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function ManageExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    duration: "",
    description: "",
  });

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadExperiences = async () => {
    try {
      const data = await api.experiences.getAll();
      setExperiences(data);
    } catch (err) {
      showToast("Failed to retrieve timeline events.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.role || !formData.company || !formData.duration || !formData.description) {
      showToast("All fields are required.", "error");
      return;
    }

    try {
      if (editingId) {
        // Edit Mode
        const updated = await api.experiences.update(editingId, formData);
        showToast("Timeline entry updated!");
        setExperiences((prev) => prev.map((exp) => (exp._id === editingId ? updated : exp)));
        setEditingId(null);
      } else {
        // Create Mode
        const created = await api.experiences.create(formData);
        showToast("Timeline entry added successfully!");
        setExperiences((prev) => [...prev, created]);
      }

      setFormData({
        role: "",
        company: "",
        duration: "",
        description: "",
      });
    } catch (err) {
      showToast(err.message || "Failed to save timeline changes.", "error");
    }
  };

  const handleEditClick = (experience) => {
    setEditingId(experience._id);
    setFormData({
      role: experience.role,
      company: experience.company,
      duration: experience.duration,
      description: experience.description,
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this timeline entry?")) return;

    try {
      await api.experiences.delete(id);
      showToast("Timeline entry removed successfully!");
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ role: "", company: "", duration: "", description: "" });
      }
    } catch (err) {
      showToast(err.message || "Failed to delete timeline entry.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ role: "", company: "", duration: "", description: "" });
  };

  return (
    <AdminLayout title="Manage Career Timeline">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem", alignItems: "start" }}>
        {/* Timeline Editor */}
        <div className="admin-content-box">
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            {editingId ? "Edit Timeline Entry" : "Add Timeline Entry"}
          </h2>
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-input-wrapper">
              <label className="form-label">Role / Program Title *</label>
              <input
                type="text"
                className="form-input"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                placeholder="AI/ML Research Assistant / BS Computer Science"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Institution / Organization *</label>
              <input
                type="text"
                className="form-input"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder="University Department / Dev Corp"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Duration / Period *</label>
              <input
                type="text"
                className="form-input"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder="Summer 2026 / 2023 - Present"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Description / Core Actions *</label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Summarize your tasks, models researched, or frameworks developed..."
                required
              ></textarea>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Timeline items list */}
        <div className="admin-content-box" style={{ overflowX: "auto" }}>
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            Timeline Milestones Inventory
          </h2>
          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Loading Timeline...</p>
          ) : experiences.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No timeline entries added yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Institution</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiences.map((exp) => (
                  <tr key={exp._id}>
                    <td>
                      <strong>{exp.role}</strong>
                    </td>
                    <td>{exp.company}</td>
                    <td>{exp.duration}</td>
                    <td>
                      <div className="admin-actions-cell">
                        <button onClick={() => handleEditClick(exp)} className="btn-secondary" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(exp._id)} className="btn-danger" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
