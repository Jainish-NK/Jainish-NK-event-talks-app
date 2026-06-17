import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Certifications() {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticCerts = [
    { title: "Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate", issuer: "Oracle", date: "2025", credentialUrl: "#" },
    { title: "Oracle Cloud Infrastructure 2025 Certified Generative AI Professional", issuer: "Oracle", date: "2025", credentialUrl: "#" },
    { title: "Oracle Cloud Infrastructure 2025 Certified Data Science Professional", issuer: "Oracle", date: "2025", credentialUrl: "#" },
    { title: "Oracle Fusion AI Agent Studio Certificate", issuer: "Oracle", date: "2025", credentialUrl: "#" },
    { title: "TCS iON Career Edge Certification", issuer: "TCS iON", date: "2024", credentialUrl: "#" },
    { title: "Building with Claude API Course", issuer: "Anthropic", date: "2024", credentialUrl: "#" },
    { title: "AI & Machine Learning Engineer Foundation Course", issuer: "Reliance Foundation", date: "2024", credentialUrl: "#" },
    { title: "Python 101 for Data Science", issuer: "IBM Developer Skills Network", date: "2023", credentialUrl: "#" }
  ];

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const data = await api.certifications.getAll();
        setCertifications(data);
      } catch (err) {
        console.warn("Using local fallback certifications list.");
      } finally {
        setLoading(false);
      }
    };
    loadCerts();
  }, []);

  const activeCerts = certifications.length > 0 ? certifications : staticCerts;

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Achievements</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">Certifications</h1>
        </div>

        {loading && certifications.length === 0 ? (
          <div className="text-center text-slate-500 py-12">Retrieving credentials...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCerts.map((cert, idx) => (
              <motion.div
                key={cert._id || idx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.1 }}
                className="p-6 bg-bgCard border border-border hover:border-primary/20 rounded-xl transition-all duration-200 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex justify-between items-center gap-2 mb-2">
                    <span className="text-xs font-semibold text-primary/90">{cert.issuer}</span>
                    <span className="text-xs text-slate-500 font-semibold">{cert.date}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-base leading-snug">
                    {cert.title}
                  </h3>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-400 hover:text-primary transition-colors flex items-center gap-1 w-fit border-t border-slate-900 pt-3 mt-1 font-semibold"
                  >
                    Verify Credential <i className="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
