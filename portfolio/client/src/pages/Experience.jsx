import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Experience() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticExperiences = [
    {
      company: "Grownited Pvt. Ltd., Ahmedabad",
      role: "AI/ML Intern",
      location: "Ahmedabad, Gujarat, India",
      startDate: "May 2025",
      endDate: "Jul 2025",
      bulletPoints: [
        "Developed LifeLine AI, an ML-powered Health Prediction System covering 3 disease categories (Alzheimer's, Diabetes, Cancer) for early risk assessment.",
        "Trained and deployed 3+ ML models using Python, Pandas, NumPy, Scikit-Learn; integrated FastAPI backend with Firebase for cloud-based storage and authentication.",
        "Contributed to model training, evaluation, documentation, and QA, ensuring on-time deployment."
      ]
    },
    {
      company: "Royal Technosoft Pvt. Ltd., Ahmedabad",
      role: "Apprenticeship Trainee",
      location: "Ahmedabad, Gujarat, India",
      startDate: "Jul 2024",
      endDate: "Present",
      bulletPoints: [
        "Trained in Full Stack Development and AI/ML fundamentals through practical workshops.",
        "Contributed to collaborative projects, technical presentations, software testing, and documentation."
      ]
    }
  ];

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const data = await api.experiences.getAll();
        setExperiences(data);
      } catch (err) {
        console.warn("Using fallback timeline details.");
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  const activeExperiences = experiences.length > 0 ? experiences : staticExperiences;

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">History</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">Experience Timeline</h1>
        </div>

        {loading && experiences.length === 0 ? (
          <div className="text-center text-slate-500 py-12">Retrieving timeline details...</div>
        ) : (
          <div className="relative border-l-2 border-slate-900 dark:border-border ml-4 sm:ml-6 flex flex-col gap-10">
            {activeExperiences.map((exp, idx) => (
              <motion.div
                key={exp._id || idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.15 }}
                className="relative pl-8 sm:pl-10"
              >
                {/* Dot */}
                <div className="absolute -left-[7px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-bgDark shadow-[0_0_8px_var(--primary)] transition-all duration-300"></div>

                <div className="p-6 bg-slate-900/30 dark:bg-bgCard border border-slate-900 dark:border-border hover:border-primary/20 dark:hover:border-primary/20 rounded-2xl transition-all duration-300">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                    <div>
                      <h2 className="text-lg font-heading font-bold text-white leading-snug">{exp.role}</h2>
                      <h3 className="text-sm font-semibold text-primary/90 mt-0.5">{exp.company}</h3>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-950 border border-slate-900 dark:border-border text-slate-400 rounded-full w-fit">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>

                  {exp.location && (
                    <div className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                      <i className="fa-solid fa-location-dot"></i> {exp.location}
                    </div>
                  )}

                  <ul className="list-none flex flex-col gap-2.5">
                    {exp.bulletPoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-sm text-slate-400 relative pl-5">
                        <span className="absolute left-0 top-1 text-primary text-[10px]">•</span>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
