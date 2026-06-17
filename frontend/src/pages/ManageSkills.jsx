import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Languages",
    level: 80,
  });

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadSkills = async () => {
    try {
      const data = await api.skills.getAll();
      setSkills(data);
    } catch (err) {
      showToast("Failed to retrieve skills catalog.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || formData.level === undefined) {
      showToast("All fields are required.", "error");
      return;
    }

    try {
      if (editingId) {
        // Edit Mode
        const updated = await api.skills.update(editingId, formData);
        showToast("Skill competency updated!");
        setSkills((prev) => prev.map((s) => (s._id === editingId ? updated : s)));
        setEditingId(null);
      } else {
        // Create Mode
        const created = await api.skills.create(formData);
        showToast("New skill added successfully!");
        setSkills((prev) => [...prev, created]);
      }

      setFormData({
        name: "",
        category: "Languages",
        level: 80,
      });
    } catch (err) {
      showToast(err.message || "Failed to update skill details.", "error");
    }
  };

  const handleEditClick = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;

    try {
      await api.skills.delete(id);
      showToast("Skill deleted successfully.");
      setSkills((prev) => prev.filter((s) => s._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ name: "", category: "Languages", level: 80 });
      }
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Languages", level: 80 });
  };

  return (
    <AdminLayout title="Manage Skills Catalog">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem", alignItems: "start" }}>
        {/* Skill Editor panel */}
        <div className="admin-content-box">
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            {editingId ? "Edit Skill Details" : "Add New Skill"}
          </h2>
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
            <div className="form-input-wrapper">
              <label className="form-label">Skill Name *</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="PyTorch / OpenCV / Docker"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Category *</label>
              <select
                className="form-input"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ background: "#0b0f19" }}
              >
                <option value="Languages">Languages</option>
                <option value="AI / ML">AI / ML</option>
                <option value="Web Development">Web Development</option>
                <option value="Tools">Tools</option>
              </select>
            </div>

            <div className="form-input-wrapper">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <label className="form-label">Proficiency Level *</label>
                <strong style={{ color: "var(--primary)" }}>{formData.level}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                style={{ width: "100%", accentColor: "var(--primary)", marginTop: "0.5rem" }}
              />
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingId ? "Update Skill" : "Add Skill"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills Catalog Inventory */}
        <div className="admin-content-box" style={{ overflowX: "auto" }}>
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            Current Skills Catalog
          </h2>
          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Loading Skills...</p>
          ) : skills.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No skills configured yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((skill) => (
                  <tr key={skill._id}>
                    <td>
                      <strong>{skill.name}</strong>
                    </td>
                    <td>{skill.category}</td>
                    <td>
                      <span style={{ color: "var(--primary)", fontWeight: "600" }}>{skill.level}%</span>
                    </td>
                    <td>
                      <div className="admin-actions-cell">
                        <button onClick={() => handleEditClick(skill)} className="btn-secondary" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(skill._id)} className="btn-danger" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
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
