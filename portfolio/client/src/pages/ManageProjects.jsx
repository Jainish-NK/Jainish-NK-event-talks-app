import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // File Upload State
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    longDescription: "",
    category: "Machine Learning",
    techStack: "",
    githubUrl: "",
    liveDemoUrl: "",
    apiDocsUrl: "",
    metrics: "",
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
      showToast("Title, category, and description are required.", "error");
      return;
    }

    const projectPayload = new FormData();
    projectPayload.append("title", formData.title);
    projectPayload.append("description", formData.description);
    projectPayload.append("longDescription", formData.longDescription);
    projectPayload.append("category", formData.category);
    projectPayload.append("techStack", formData.techStack); // parsed as comma-separated string on backend
    projectPayload.append("githubUrl", formData.githubUrl);
    projectPayload.append("liveDemoUrl", formData.liveDemoUrl);
    projectPayload.append("apiDocsUrl", formData.apiDocsUrl);
    projectPayload.append("metrics", formData.metrics);
    projectPayload.append("featured", formData.featured);

    if (thumbnailFile) {
      projectPayload.append("thumbnail", thumbnailFile);
    }

    try {
      if (editingId) {
        const updated = await api.projects.update(editingId, projectPayload);
        showToast("Project details updated successfully!");
        setProjects((prev) => prev.map((p) => (p._id === editingId ? updated : p)));
        setEditingId(null);
      } else {
        const created = await api.projects.create(projectPayload);
        showToast("Project created successfully!");
        setProjects((prev) => [...prev, created]);
      }

      setFormData({
        title: "",
        description: "",
        longDescription: "",
        category: "Machine Learning",
        techStack: "",
        githubUrl: "",
        liveDemoUrl: "",
        apiDocsUrl: "",
        metrics: "",
        featured: false,
      });
      setThumbnailFile(null);
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed.", "error");
    }
  };

  const handleEditClick = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription || "",
      category: project.category,
      techStack: project.techStack ? project.techStack.join(", ") : "",
      githubUrl: project.githubUrl || "",
      liveDemoUrl: project.liveDemoUrl || "",
      apiDocsUrl: project.apiDocsUrl || "",
      metrics: project.metrics || "",
      featured: project.featured || false,
    });
    setThumbnailFile(null);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await api.projects.delete(id);
      showToast("Project deleted successfully.");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      description: "",
      longDescription: "",
      category: "Machine Learning",
      techStack: "",
      githubUrl: "",
      liveDemoUrl: "",
      apiDocsUrl: "",
      metrics: "",
      featured: false,
    });
    setThumbnailFile(null);
  };

  return (
    <AdminLayout title="Manage Projects Catalog">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Project Form */}
        <div className="lg:col-span-5 bg-bgCard border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            {editingId ? "Edit Project Details" : "Add New Project"}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Project Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="CropYield AI"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Short Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="2"
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none resize-none"
                placeholder="Brief summary card teaser..."
                required
              ></textarea>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Long Project Details</label>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                rows="4"
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none resize-none"
                placeholder="Detailed explanations displayed in modal view overlays..."
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  style={{ background: "#0b0f19" }}
                >
                  <option value="Machine Learning">Machine Learning</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Metrics (optional)</label>
                <input
                  type="text"
                  name="metrics"
                  value={formData.metrics}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="96.49% R² Score"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Tech Stack (comma-separated)</label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="Python, Scikit-Learn, FastAPI, React"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">GitHub Link</label>
                <input
                  type="url"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Live Demo Link</label>
                <input
                  type="url"
                  name="liveDemoUrl"
                  value={formData.liveDemoUrl}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="https://demo-yield.com/..."
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 border-t border-slate-900 pt-3">
              <label className="text-xs font-semibold text-slate-400">Thumbnail Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setThumbnailFile(e.target.files[0])}
                className="bg-bgDark border border-border rounded-lg px-3 py-2 text-xs text-slate-400 focus:border-primary outline-none"
              />
              {thumbnailFile && (
                <span className="text-[10px] text-primary">Pending upload: {thumbnailFile.name}</span>
              )}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="featured"
                id="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="featured" className="text-xs font-semibold text-slate-400 cursor-pointer">
                Feature project on homepage
              </label>
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
                {editingId ? "Update Project" : "Add Project"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Project Table Inventory */}
        <div className="lg:col-span-7 bg-bgCard border border-border p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Project Inventory</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading catalog...</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-slate-500">No projects configured.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Title</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40 text-sm">
                {projects.map((project) => (
                  <tr key={project._id} className="hover:bg-slate-900/10">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>
                        {project.title}
                        {project.featured && (
                          <span className="ml-2 bg-primary/10 border border-primary/15 text-primary text-[8px] font-bold px-2 py-0.5 rounded uppercase">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{project.category}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(project)} className="text-xs font-semibold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(project._id)} className="text-xs font-semibold px-2.5 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-md text-red-400">
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
