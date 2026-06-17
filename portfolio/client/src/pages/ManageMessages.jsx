import React, { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function ManageMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadMessages = async () => {
    try {
      const data = await api.messages.getAll();
      setMessages(data);
    } catch (err) {
      showToast("Failed to retrieve messages.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const updated = await api.messages.markAsRead(id);
      showToast("Inquiry marked as read.");
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)));
    } catch (err) {
      showToast(err.response?.data?.message || "Operation failed.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry permanently?")) return;

    try {
      await api.messages.delete(id);
      showToast("Inquiry deleted successfully.");
      setMessages((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete message.", "error");
    }
  };

  return (
    <AdminLayout title="Recruiter Message Inbox">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="bg-bgCard border border-border p-6 rounded-xl shadow-lg">
        <h2 className="text-lg font-heading font-bold text-white mb-6">Inbox Inquiries ({messages.length})</h2>

        {loading ? (
          <p className="text-sm text-slate-500">Loading inbox messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No inquiries have been received yet.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`p-5 bg-slate-950/40 border rounded-xl flex flex-col sm:flex-row justify-between items-start gap-4 transition-all duration-200 ${
                  !msg.isRead ? "border-primary/20 bg-primary/[0.02]" : "border-slate-900"
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-2 mb-2">
                    <h3 className="font-heading font-bold text-white text-base">{msg.name}</h3>
                    <a href={`mailto:${msg.email}`} className="text-xs text-primary underline">
                      {msg.email}
                    </a>
                    <span className="text-[10px] text-slate-500 font-medium sm:ml-auto">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-white mb-2">
                    Subject: <span className="text-slate-400 font-medium">{msg.subject || "No Subject"}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-light italic bg-slate-950 p-3.5 rounded border border-white/5">
                    "{msg.message}"
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto shrink-0 justify-end mt-2 sm:mt-0">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(msg._id)}
                      className="px-3.5 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/25 text-primary text-xs font-semibold rounded-lg transition-all"
                    >
                      Mark as Read
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="px-3.5 py-1.5 bg-red-500/10 border border-red-500/20 hover:bg-red-500/25 text-red-400 text-xs font-semibold rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
