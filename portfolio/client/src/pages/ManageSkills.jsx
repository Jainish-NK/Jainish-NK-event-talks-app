import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Languages & Tools",
    level: 80,
    iconName: "fa-solid fa-code",
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
        category: "Languages & Tools",
        level: 80,
        iconName: "fa-solid fa-code",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update skill details.", "error");
    }
  };

  const handleEditClick = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      level: skill.level,
      iconName: skill.iconName || "fa-solid fa-code",
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
        setFormData({ name: "", category: "Languages & Tools", level: 80, iconName: "fa-solid fa-code" });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Delete failed.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", category: "Languages & Tools", level: 80, iconName: "fa-solid fa-code" });
  };

  return (
    <AdminLayout title="Manage Skills Catalog">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Skill Editor panel */}
        <div className="lg:col-span-5 bg-bgCard border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            {editingId ? "Edit Skill Details" : "Add New Skill"}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Skill Name *</label>
              <input
                type="text"
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Python / Scikit-Learn"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Category *</label>
              <select
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Languages & Tools">Languages & Tools</option>
                <option value="AI / Machine Learning">AI / Machine Learning</option>
                <option value="Data Science">Data Science</option>
                <option value="Backend & Deployment">Backend & Deployment</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">FontAwesome Icon Class</label>
              <input
                type="text"
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                name="iconName"
                value={formData.iconName}
                onChange={handleInputChange}
                placeholder="fa-brands fa-python"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-400">
                <span>Proficiency Level *</span>
                <strong className="text-primary">{formData.level}%</strong>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="w-full accent-primary mt-2 cursor-pointer"
              />
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
                {editingId ? "Update Skill" : "Add Skill"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Skills Catalog Inventory */}
        <div className="lg:col-span-7 bg-bgCard border border-border p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            Current Skills Catalog
          </h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading catalog...</p>
          ) : skills.length === 0 ? (
            <p className="text-sm text-slate-500">No skills configured yet.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Category</th>
                  <th className="text-left py-3 px-4">Level</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40 text-sm">
                {skills.map((skill) => (
                  <tr key={skill._id} className="hover:bg-slate-900/10">
                    <td className="py-3.5 px-4 font-semibold text-white flex items-center gap-2">
                      <i className={`${skill.iconName || "fa-solid fa-code"} text-primary w-4 text-center`}></i>
                      {skill.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{skill.category}</td>
                    <td className="py-3.5 px-4 text-primary font-bold">{skill.level}%</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(skill)} className="text-xs font-semibold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(skill._id)} className="text-xs font-semibold px-2.5 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-md text-red-400">
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
