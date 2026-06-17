import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageCertifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    credentialUrl: "",
  });

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadCertifications = async () => {
    try {
      const data = await api.certifications.getAll();
      setCertifications(data);
    } catch (err) {
      showToast("Failed to retrieve certifications.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertifications();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuer || !formData.date) {
      showToast("Please fill in the required fields.", "error");
      return;
    }

    try {
      if (editingId) {
        const updated = await api.certifications.update(editingId, formData);
        showToast("Certification updated successfully!");
        setCertifications((prev) => prev.map((c) => (c._id === editingId ? updated : c)));
        setEditingId(null);
      } else {
        const created = await api.certifications.create(formData);
        showToast("Certification created successfully!");
        setCertifications((prev) => [...prev, created]);
      }

      setFormData({
        title: "",
        issuer: "",
        date: "",
        credentialUrl: "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed.", "error");
    }
  };

  const handleEditClick = (cert) => {
    setEditingId(cert._id);
    setFormData({
      title: cert.title,
      issuer: cert.issuer,
      date: cert.date,
      credentialUrl: cert.credentialUrl || "",
    });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;

    try {
      await api.certifications.delete(id);
      showToast("Certification deleted successfully!");
      setCertifications((prev) => prev.filter((c) => c._id !== id));
      if (editingId === id) cancelEdit();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete certification.", "error");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      title: "",
      issuer: "",
      date: "",
      credentialUrl: "",
    });
  };

  return (
    <AdminLayout title="Manage Certifications">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Editor Form */}
        <div className="lg:col-span-5 bg-bgCard border border-border p-6 rounded-xl shadow-lg">
          <h2 className="text-lg font-heading font-bold text-white mb-6">
            {editingId ? "Edit Certification Details" : "Add New Certification"}
          </h2>
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Certification Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="OCI Data Science Professional"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Issuer *</label>
              <input
                type="text"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="Oracle / IBM"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-400">Date Issued *</label>
                <input
                  type="text"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                  placeholder="2025"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400">Credential Verification Link</label>
              <input
                type="url"
                name="credentialUrl"
                value={formData.credentialUrl}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:border-primary outline-none"
                placeholder="https://verify.oracle.com/..."
              />
            </div>

            <div className="flex gap-4 mt-2">
              <button type="submit" className="flex-1 py-2.5 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all">
                {editingId ? "Update Certificate" : "Add Certificate"}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-sm font-semibold transition-colors">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Credentials Table */}
        <div className="lg:col-span-7 bg-bgCard border border-border p-6 rounded-xl shadow-lg overflow-x-auto">
          <h2 className="text-lg font-heading font-bold text-white mb-6">Credentials Inventory</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading details...</p>
          ) : certifications.length === 0 ? (
            <p className="text-sm text-slate-500">No certifications configured.</p>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-900 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Title / Issuer</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-950/40 text-sm">
                {certifications.map((cert) => (
                  <tr key={cert._id} className="hover:bg-slate-900/10">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div>{cert.title}</div>
                      <div className="text-xs text-primary font-medium mt-0.5">{cert.issuer}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{cert.date}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(cert)} className="text-xs font-semibold px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-md text-slate-300">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(cert._id)} className="text-xs font-semibold px-2.5 py-1 bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 rounded-md text-red-400">
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
