import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import Toast from "../components/Toast";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showToast("Please supply both credentials.", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await api.auth.login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      showToast("Session authorized! Redirecting to CMS Dashboard...");
      
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      showToast(err.response?.data?.message || "Invalid authentication credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark flex items-center justify-center p-6 relative">
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-primary/10 filter blur-[80px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-bgCard border border-border rounded-2xl shadow-glow relative">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-heading font-extrabold text-white mb-2">CMS Authorization</h2>
          <p className="text-xs text-slate-500">Log in to update your portfolio sections</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
              placeholder="admin"
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all mt-2"
          >
            {loading ? "Authenticating session..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-primary hover:underline">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  );
}
