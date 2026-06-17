import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // id of project being edited, or null for new project
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Machine Learning",
    tags: "",
    github: "",
    live: "",
    image: "",
    featured: false,
  });

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadProjects = async () => {
    try {
      const data = await api.projects.getAll();
      setProjects(data);
    } catch (err) {
      showToast("Failed to retrieve projects.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.category) {
      showToast("Please fill in the required fields.", "error");
      return;
    }

    // Process tags into an array
    const processedTags = formData.tags
      ? formData.tags.split(",").map((t) => t.trim()).filter((t) => t !== "")
      : [];

    const payload = {
      ...formData,
      tags: processedTags,
    };

    try {
      if (editingId) {
        // Edit Mode
        const updated = await api.projects.update(editingId, payload);
        showToast("Project updated successfully!");
        setProjects((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
        setEditingId(null);
      } else {
        // Create Mode
        const created = await api.projects.create(payload);
        showToast("Project created successfully!");
        setProjects((prev) => [...prev, created]);
      }
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "Machine Learning",
        tags: "",
        github: "",
        live: "",
        image: "",
        featured: false,
      });
    } catch (err) {
      showToast(err.message || "Operation failed.", "error");
    }
  };

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      tags: project.tags ? project.tags.join(", ") : "",
      github: project.github || "",
      live: project.live || "",
      image: project.image || "",
      featured: project.featured || false,
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.projects.delete(id);
      showToast("Project deleted successfully!");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({
          title: "",
          description: "",
          category: "Machine Learning",
          tags: "",
          github: "",
          live: "",
          image: "",
          featured: false,
        });
      }
    } catch (err) {
      showToast(err.message || "Failed to delete project.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      category: "Machine Learning",
      tags: "",
      github: "",
      live: "",
      image: "",
      featured: false,
    });
  };

  return (
    <AdminLayout title="Manage Projects">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
        {/* Project Editing Form */}
        <div className="admin-content-box">
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            {editingId ? "Edit Project Details" : "Add New Project"}
          </h2>
          <form onSubmit={handleFormSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-input-wrapper">
              <label className="form-label">Project Title *</label>
              <input
                type="text"
                className="form-input"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Drone Navigation ML Visualizer"
                required
              />
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Description *</label>
              <textarea
                className="form-input"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="A details paragraph about the project..."
                required
              ></textarea>
            </div>

            <div className="form-group-row">
              <div className="form-input-wrapper">
                <label className="form-label">Category *</label>
                <select
                  className="form-input"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  style={{ background: "#0b0f19" }}
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-input-wrapper">
                <label className="form-label">Tags (comma-separated)</label>
                <input
                  type="text"
                  className="form-input"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="Python, PyTorch, React"
                />
              </div>
            </div>

            <div className="form-group-row">
              <div className="form-input-wrapper">
                <label className="form-label">GitHub URL</label>
                <input
                  type="url"
                  className="form-input"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/..."
                />
              </div>

              <div className="form-input-wrapper">
                <label className="form-label">Live Demo URL</label>
                <input
                  type="url"
                  className="form-input"
                  name="live"
                  value={formData.live}
                  onChange={handleInputChange}
                  placeholder="https://demo.com/..."
                />
              </div>
            </div>

            <div className="form-input-wrapper">
              <label className="form-label">Image URL</label>
              <input
                type="url"
                className="form-input"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                style={{ width: "16px", height: "16px", cursor: "pointer" }}
              />
              <label htmlFor="featured" className="form-label" style={{ cursor: "pointer" }}>
                Feature this project on homepage
              </label>
            </div>

            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {editingId ? "Update Project" : "Add Project"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn-secondary">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Projects list */}
        <div className="admin-content-box" style={{ overflowX: "auto" }}>
          <h2 className="skills-column-title" style={{ marginBottom: "1.2rem" }}>
            Current Project Inventory
          </h2>
          {loading ? (
            <p style={{ color: "var(--text-secondary)" }}>Loading Projects...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: "var(--text-secondary)" }}>No projects created yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <div>
                        <strong>{project.title}</strong>
                        {project.featured && (
                          <span
                            style={{
                              marginLeft: "0.5rem",
                              fontSize: "0.65rem",
                              backgroundColor: "var(--primary-glow)",
                              color: "var(--primary)",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontWeight: "600",
                            }}
                          >
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td>{project.category}</td>
                    <td>
                      <div className="admin-actions-cell">
                        <button onClick={() => handleEditClick(project)} className="btn-secondary" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(project._id)} className="btn-danger" style={{ fontSize: "0.78rem", padding: "4px 8px" }}>
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
