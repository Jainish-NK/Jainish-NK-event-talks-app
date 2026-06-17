import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 dark:border-border bg-slate-950 dark:bg-bgDark py-8 text-center text-slate-500 text-sm">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Jainish Khunt. All rights reserved.</p>
        <div className="flex gap-6 text-slate-400">
          <a href="https://github.com/Jainish-NK" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <i className="fa-brands fa-github text-lg"></i>
          </a>
          <a href="https://www.linkedin.com/in/jainish-khunt-936a08320/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <i className="fa-brands fa-linkedin text-lg"></i>
          </a>
          <a href="https://wa.me/919998983110" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            <i className="fa-brands fa-whatsapp text-lg"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}
