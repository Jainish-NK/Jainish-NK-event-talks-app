import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../services/api";

export default function AdminLayout({ children, title }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = api.auth.getCurrentUser();

  useEffect(() => {
    if (!api.auth.isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    api.auth.logout();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary"
      : "text-slate-400 hover:text-white hover:bg-slate-900 border-l-4 border-transparent";
  };

  const sidebarLinks = [
    { label: "Dashboard", path: "/admin/dashboard", icon: "fa-chart-line" },
    { label: "Edit Profile", path: "/admin/profile", icon: "fa-user" },
    { label: "Manage Skills", path: "/admin/skills", icon: "fa-brain" },
    { label: "Manage Timeline", path: "/admin/experience", icon: "fa-timeline" },
    { label: "Manage Projects", path: "/admin/projects", icon: "fa-code" },
    { label: "Certifications", path: "/admin/certifications", icon: "fa-certificate" },
    { label: "Education Settings", path: "/admin/education", icon: "fa-graduation-cap" },
    { label: "Message Inbox", path: "/admin/messages", icon: "fa-envelope" },
  ];

  if (!currentUser) {
    return (
      <div className="min-height-screen bg-bgDark flex items-center justify-center text-white text-sm">
        Authenticating access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bgDark flex text-slate-100 font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-900 flex flex-col shrink-0 bg-slate-950">
        <div className="h-20 flex items-center px-6 border-b border-slate-900">
          <span className="text-lg font-heading font-extrabold tracking-tight text-white">
            CMS Console<span className="text-primary">.</span>
          </span>
        </div>

        <nav className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-5 py-3 text-sm transition-all duration-150 ${isActive(
                link.path
              )}`}
            >
              <i className={`fa-solid ${link.icon} w-5 text-center`}></i>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-900">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-650 hover:bg-red-600 active:scale-95 text-white font-semibold text-sm rounded-lg transition-all duration-150"
            style={{ backgroundColor: "#ef4444" }}
          >
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-slate-900 flex items-center justify-between px-8 bg-slate-950">
          <h1 className="text-xl font-heading font-extrabold tracking-tight text-white">{title}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>
              Welcome, <strong className="text-primary font-medium">{currentUser.username}</strong>
            </span>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 border border-slate-800 hover:border-primary text-slate-300 hover:text-primary rounded-lg text-xs font-semibold tracking-wide transition-all"
            >
              View Site <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-[10px]"></i>
            </Link>
          </div>
        </header>

        {/* Dynamic page contents */}
        <main className="flex-1 overflow-y-auto p-8 bg-bgDark">{children}</main>
      </div>
    </div>
  );
}
