import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-bgDark">
      <Navbar />

      <main className="max-w-md mx-auto px-6 text-center flex flex-col items-center justify-center flex-1">
        <span className="text-primary font-bold text-base tracking-widest uppercase mb-4">Error 404</span>
        <h1 className="text-5xl font-heading font-extrabold text-white mb-6">Page Not Found</h1>
        <p className="text-slate-400 text-sm leading-relaxed mb-8">
          The page you are trying to access does not exist or has been relocated. Return to the homepage.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-cyan-500/20"
        >
          Return to Homepage
        </Link>
      </main>

      <Footer />
    </div>
  );
}
