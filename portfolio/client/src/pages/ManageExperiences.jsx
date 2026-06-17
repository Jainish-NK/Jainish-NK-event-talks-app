import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "Present",
    bulletsInput: "", // Temporary text field split by lines on submit
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company || !formData.role || !formData.startDate || !formData.bulletsInput) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const bulletPointsArray = formData.bulletsInput
      .split("\n")
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      company: formData.company,
      role: formData.role,
      location: formData.location,
      startDate: formData.startDate,
      endDate: formData.endDate,
      bulletPoints: bulletPointsArray,
    };

    try {
      if (editingId) {
        const updated = await api.experiences.update(editingId, payload);
        showToast("Timeline entry updated successfully!");
        setExperiences((prev) => prev.map((exp) => (exp._id === editingId ? updated : exp)));
        setEditingId(null);
      } else {
        const created = await api.experiences.create(payload);
        showToast("Timeline entry created successfully!");
        setExperiences((prev) => [...prev, created]);
      }

      setFormData({
        company: "",
        role: "",
        location: "",
        startDate: "",
        endDate: "Present",
        bulletsInput: "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed.", "error");
    }
  };

  const handleEditClick = (exp) => {
    setEditingId(exp._id);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location || "",
      startDate: exp.startDate,
      endDate: exp.endDate || "Present",
      bulletsInput: exp.bulletPoints ? exp.bulletPoints.join("\n") : "",
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;

    try {
      await api.experiences.delete(id);
      showToast("Timeline entry deleted successfully!");
      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      if (editingId === id) {
        setEditingId(null);
        setFormData({ company: "", role: "", location: "", startDate: "", endDate: "Present", bulletsInput: "" });
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete timeline entry.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      company: "",
      role: "",
      location: "",
      startDate: "",
      endDate: "Present",
      bulletsInput: "",
    });
  };

  return (
    <AdminLayout title="Manage Career Timeline">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Experience Editor */}
        <div className="lg:col-span-5 bg-bgCard border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            {editingId ? "Edit Timeline Milestone" : "Add New Milestone"}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Company Name *</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="Grownited Pvt. Ltd."
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Role / Position *</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="AI/ML Intern"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="Ahmedabad, Gujarat, India"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Start Date *</label>
                <input
                  type="text"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="May 2025"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">End Date *</label>
                <input
                  type="text"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="Jul 2025"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Bullet Points (one per line) *</label>
              <textarea
                name="bulletsInput"
                value={formData.bulletsInput}
                onChange={handleInputChange}
                rows="5"
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none resize-none"
                placeholder="Developed LifeLine AI health prediction platform.&#10;Trained and deployed ML regression models.&#10;Contributed to API testing."
                required
              ></textarea>
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Timeline Table list */}
        <div className="lg:col-span-7 bg-bgCard border border-border p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Timeline Inventory</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading timeline...</p>
          ) : experiences.length === 0 ? (
            <p className="text-sm text-slate-500">No milestones set in timeline.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Role / Company</th>
                  <th className="text-left py-3 px-4">Period</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40 text-sm">
                {experiences.map((exp) => (
                  <tr key={exp._id} className="hover:bg-slate-900/10">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{exp.role}</div>
                      <div className="text-xs text-primary font-medium mt-0.5">{exp.company}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {exp.startDate} - {exp.endDate}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(exp)} className="text-xs font-semibold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(exp._id)} className="text-xs font-semibold px-2.5 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-md text-red-400">
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
