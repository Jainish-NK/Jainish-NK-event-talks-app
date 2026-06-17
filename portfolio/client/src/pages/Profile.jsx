import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function Profile() {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    tagline: "",
    summary: "",
  });
  
  // Files state
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api.profile.get();
        setFormData({
          name: data.name || "",
          title: data.title || "",
          tagline: data.tagline || "",
          summary: data.summary || "",
        });
      } catch (err) {
        showToast("Error retrieving profile parameters.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.title || !formData.summary) {
      showToast("Please supply all required profile metadata.", "error");
      return;
    }

    setSubmitLoading(true);

    const dataPayload = new FormData();
    dataPayload.append("name", formData.name);
    dataPayload.append("title", formData.title);
    dataPayload.append("tagline", formData.tagline);
    dataPayload.append("summary", formData.summary);

    if (profilePhoto) {
      dataPayload.append("profilePhoto", profilePhoto);
    }
    if (resume) {
      dataPayload.append("resume", resume);
    }

    try {
      const updated = await api.profile.update(dataPayload);
      showToast("Profile specifications updated successfully!");
      // Reset files state
      setProfilePhoto(null);
      setResume(null);
      // Update form
      setFormData({
        name: updated.name || "",
        title: updated.title || "",
        tagline: updated.tagline || "",
        summary: updated.summary || "",
      });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update profile parameters.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <AdminLayout title="Modify Profile Branding">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500">Retrieving profile metadata...</div>
      ) : (
        <div className="max-w-2xl bg-bgCard border border-border p-8 rounded-2xl">
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
                  placeholder="Jainish Khunt"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Role / Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
                  placeholder="AI / ML Engineer & Developer"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">Tagline *</label>
              <input
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
                placeholder="Crafting Neural Intelligence & Web Architectures."
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-400">About Summary *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                rows="4"
                className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none resize-none"
                placeholder="Full summary displayed in the biography block..."
                required
              ></textarea>
            </div>

            {/* Media Upload Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-slate-900 pt-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Profile Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files[0])}
                  className="bg-bgDark border border-border rounded-lg px-3 py-2 text-xs text-slate-400 focus:border-primary outline-none"
                />
                {profilePhoto && (
                  <span className="text-[10px] text-primary">Pending upload: {profilePhoto.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Resume PDF</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setResume(e.target.files[0])}
                  className="bg-bgDark border border-border rounded-lg px-3 py-2 text-xs text-slate-400 focus:border-primary outline-none"
                />
                {resume && (
                  <span className="text-[10px] text-primary">Pending upload: {resume.name}</span>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading}
              className="mt-4 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all"
            >
              {submitLoading ? "Updating parameters..." : "Save Profile Configuration"}
            </button>
          </form>
        </div>
      )}
    </AdminLayout>
  );
}
