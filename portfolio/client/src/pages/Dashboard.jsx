import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, experiences: 0, messages: 0, unreadMessages: 0, certifications: 0 });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [projects, skills, experiences, certifications, messages] = await Promise.all([
          api.projects.getAll(),
          api.skills.getAll(),
          api.experiences.getAll(),
          api.certifications.getAll(),
          api.messages.getAll(),
        ]);

        const unreadCount = messages.filter((m) => !m.isRead).length;

        setStats({
          projects: projects.length,
          skills: skills.length,
          experiences: experiences.length,
          certifications: certifications.length,
          messages: messages.length,
          unreadMessages: unreadCount,
        });

        // Slice top 3 recent messages
        setRecentMessages(messages.slice(0, 3));
      } catch (err) {
        showToast("Error pulling console metrics from server.", "error");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <AdminLayout title="System Metrics Summary">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      {loading ? (
        <div className="text-slate-500">Retrieving system summary data...</div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-bgCard border border-border rounded-xl flex flex-col gap-2 shadow-lg">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Projects</span>
              <span className="text-3xl font-heading font-extrabold text-white">{stats.projects}</span>
              <Link to="/admin/projects" className="text-xs text-primary hover:underline mt-2">
                Manage Portfolio →
              </Link>
            </div>

            <div className="p-6 bg-bgCard border border-border rounded-xl flex flex-col gap-2 shadow-lg">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Technical Skills</span>
              <span className="text-3xl font-heading font-extrabold text-white">{stats.skills}</span>
              <Link to="/admin/skills" className="text-xs text-primary hover:underline mt-2">
                Manage Skills →
              </Link>
            </div>

            <div className="p-6 bg-bgCard border border-border rounded-xl flex flex-col gap-2 shadow-lg">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Certifications</span>
              <span className="text-3xl font-heading font-extrabold text-white">{stats.certifications}</span>
              <Link to="/admin/certifications" className="text-xs text-primary hover:underline mt-2">
                Manage Credentials →
              </Link>
            </div>

            <div
              className={`p-6 bg-bgCard border rounded-xl flex flex-col gap-2 shadow-lg ${
                stats.unreadMessages > 0 ? "border-primary/30 shadow-primary/5" : "border-border"
              }`}
            >
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Unread Inquiries</span>
              <span className={`text-3xl font-heading font-extrabold ${stats.unreadMessages > 0 ? "text-primary" : "text-white"}`}>
                {stats.unreadMessages}
              </span>
              <Link to="/admin/messages" className="text-xs text-primary hover:underline mt-2">
                View Mailbox →
              </Link>
            </div>
          </div>

          {/* Recent feedback block */}
          <div className="p-6 bg-bgCard border border-border rounded-xl">
            <h2 className="text-lg font-heading font-bold text-white mb-6 border-b border-slate-900 pb-3">
              Recent Recruiter Inquiries
            </h2>

            {recentMessages.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No contact submissions found in database.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {recentMessages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`p-4 bg-slate-950/40 border rounded-lg flex flex-col gap-2 ${
                      !msg.isRead ? "border-primary/20 bg-primary/5" : "border-slate-900"
                    }`}
                  >
                    <div className="flex justify-between items-baseline gap-2">
                      <div>
                        <strong className="text-sm text-white">{msg.name}</strong>{" "}
                        <span className="text-xs text-slate-500">({msg.email})</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-primary">Subject: {msg.subject || "No Subject"}</div>
                    <p className="text-xs text-slate-400 leading-relaxed font-light italic">"{msg.message}"</p>
                  </div>
                ))}
                
                <div className="mt-4">
                  <Link
                    to="/admin/messages"
                    className="px-4 py-2 text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white rounded-lg transition-all"
                  >
                    View Full Mailbox
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
