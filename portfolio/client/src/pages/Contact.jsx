import React, { useState } from "react";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setLoading(true);
    try {
      await api.messages.submit(formData);
      showToast("Your message was sent successfully! I will reply shortly.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to transmit message. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      {/* Toast notifications */}
      <div className="toast-overlay">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
        ))}
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Connect</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">Get In Touch</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Details Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="p-6 bg-bgCard border border-border rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-primary flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-envelope"></i>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Email Address</span>
                <a href="mailto:khuntjainish48@gmail.com" className="text-sm font-semibold text-white hover:text-primary transition-colors">
                  khuntjainish48@gmail.com
                </a>
              </div>
            </div>

            <div className="p-6 bg-bgCard border border-border rounded-xl flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-cyan-500/10 text-primary flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-phone"></i>
              </div>
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Phone Connection</span>
                <span className="text-sm font-semibold text-white">+91-9998983110</span>
              </div>
            </div>

            {/* Whatsapp quick chat button */}
            <a
              href="https://wa.me/919998983110"
              target="_blank"
              rel="noopener noreferrer"
              className="p-6 bg-green-500/10 border border-green-500/30 hover:border-green-500 rounded-xl flex items-center gap-4 transition-all duration-200"
            >
              <div className="w-12 h-12 rounded-lg bg-green-500/20 text-green-400 flex items-center justify-center text-2xl shrink-0">
                <i className="fa-brands fa-whatsapp"></i>
              </div>
              <div>
                <span className="text-xs text-green-500 uppercase tracking-wider block font-bold">WhatsApp Messenger</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  Chat Instantly on WhatsApp <i className="fa-solid fa-chevron-right text-xs"></i>
                </span>
              </div>
            </a>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-8 bg-bgCard border border-border rounded-2xl flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                    placeholder="Jane Doe"
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold text-slate-400">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                    placeholder="jane@example.com"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors"
                  placeholder="Internship / Collaboration Details"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-400">Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows="5"
                  className="bg-bgDark border border-border rounded-lg px-4 py-3 text-sm text-white focus:border-primary outline-none transition-colors resize-none"
                  placeholder="Hi Jainish, I'd like to discuss a project..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 text-white font-bold text-sm rounded-lg shadow-lg tracking-wide transition-all"
              >
                {loading ? "Transmitting message..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
