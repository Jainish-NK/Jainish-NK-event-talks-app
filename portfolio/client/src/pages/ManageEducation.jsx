import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageEducation() {
  const [educationList, setEducationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    institution: "",
    degree: "",
    duration: "",
    score: "",
    level: "college",
  });

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadEducation = async () => {
    try {
      const data = await api.education.getAll();
      setEducationList(data);
    } catch (err) {
      showToast("Failed to retrieve education records.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEducation();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.institution || !formData.degree || !formData.duration) {
      showToast("Institution, degree, and duration are required fields.", "error");
      return;
    }

    try {
      if (editingId) {
        const updated = await api.education.update(editingId, formData);
        showToast("Education entry updated successfully!");
        setEducationList((prev) => prev.map((edu) => (edu._id === editingId ? updated : edu)));
        setEditingId(null);
      } else {
        const created = await api.education.create(formData);
        showToast("Education entry added successfully!");
        setEducationList((prev) => [...prev, created]);
      }

      setFormData({
        institution: "",
        degree: "",
        duration: "",
        score: "",
        level: "college",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed.", "error");
    }
  };

  const handleEditClick = (edu) => {
    setEditingId(edu._id);
    setFormData({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
      score: edu.score || "",
      level: edu.level || "college",
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this education entry?")) return;

    try {
      await api.education.delete(id);
      showToast("Education entry deleted successfully!");
      setEducationList((prev) => prev.filter((edu) => edu._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete education entry.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      institution: "",
      degree: "",
      duration: "",
      score: "",
      level: "college",
    });
  };

  return (
    <AdminLayout title="Manage Education Records">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-bgCard border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            {editingId ? "Edit Education Record" : "Add Education Record"}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Institution Name *</label>
              <input
                type="text"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="JG University, Ahmedabad"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Degree / Study Program *</label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="B.Tech in AI & ML"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Duration Period *</label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="2024 - Present"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Score (CGPA/Grade)</label>
                <input
                  type="text"
                  name="score"
                  value={formData.score}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="8.0/10 CGPA"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Educational Stage *</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                style={{ background: "#0b0f19" }}
              >
                <option value="college">College / University</option>
                <option value="school">School (K-12)</option>
              </select>
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
                {editingId ? "Update Record" : "Add Record"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Education List Table */}
        <div className="lg:col-span-7 bg-bgCard border border-border p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Education Records</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading details...</p>
          ) : educationList.length === 0 ? (
            <p className="text-sm text-slate-500">No education history found.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Institution / Degree</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40 text-sm">
                {educationList.map((edu) => (
                  <tr key={edu._id} className="hover:bg-slate-900/10">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{edu.institution}</div>
                      <div className="text-xs text-primary font-medium mt-0.5">{edu.degree} ({edu.duration})</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{edu.score || "N/A"}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(edu)} className="text-xs font-semibold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(edu._id)} className="text-xs font-semibold px-2.5 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-md text-red-400">
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
