import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useThemeStore from "../store/useThemeStore";

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path
      ? "text-primary font-bold"
      : "text-slate-400 hover:text-primary transition-colors duration-200";
  };

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skills", path: "/skills" },
    { label: "Experience", path: "/experience" },
    { label: "Projects", path: "/projects" },
    { label: "Certifications", path: "/certifications" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/75 dark:bg-bgDark/75 backdrop-blur-md border-b border-slate-900 dark:border-border transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Brand */}
        <Link to="/" className="text-2xl font-heading font-extrabold tracking-tight text-white">
          Jainish<span className="text-primary">.</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} className={`text-sm font-medium ${isActive(item.path)}`}>
              {item.label}
            </Link>
          ))}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 dark:bg-bgCard hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors duration-200"
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <i className="fa-solid fa-sun text-yellow-400"></i>
            ) : (
              <i className="fa-solid fa-moon text-indigo-400"></i>
            )}
          </button>

          {/* CMS Link */}
          <Link to="/admin/login" className="text-xs font-semibold px-4 py-2 border border-slate-800 rounded-lg hover:border-primary text-slate-300 hover:text-primary transition-all duration-200">
            CMS Console
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-900 dark:bg-bgCard hover:bg-slate-800 dark:hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            {theme === "dark" ? (
              <i className="fa-solid fa-sun text-yellow-400"></i>
            ) : (
              <i className="fa-solid fa-moon text-indigo-400"></i>
            )}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-slate-400 hover:text-white text-xl focus:outline-none"
          >
            <i className={`fa-solid ${mobileOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-950/95 dark:bg-bgDark/95 border-b border-slate-900 dark:border-border px-6 py-4 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-semibold py-1 ${isActive(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/admin/login"
            onClick={() => setMobileOpen(false)}
            className="text-sm font-semibold text-slate-400 hover:text-primary py-1"
          >
            CMS Access
          </Link>
        </div>
      )}
    </nav>
  );
}
