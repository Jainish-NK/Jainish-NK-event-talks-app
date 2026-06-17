import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackProfile = {
    name: "Jainish Khunt",
    summary: "AI/ML engineering student actively pursuing a B.Tech and building full-stack web solutions. Experienced in developing machine learning models for early health prediction and agricultural crop production forecasting.",
    profilePhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
  };

  const staticEducation = [
    { institution: "JG University, Ahmedabad", degree: "B.Tech in AI & ML (Semester 4 pursuing)", duration: "Aug 2024 - Present", score: "8.0/10 CGPA (Sem 3)", level: "college" },
    { institution: "Vedant International School, GSEB", degree: "Class XII (Science)", duration: "2023 - 2024", score: "Completed", level: "school" },
    { institution: "Swaminarayan Dham International School, GSEB", degree: "Class X", duration: "2021 - 2022", score: "Completed", level: "school" }
  ];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [profileData, eduData] = await Promise.all([
          api.profile.get(),
          api.education.getAll(),
        ]);
        setProfile(profileData);
        setEducation(eduData);
      } catch (err) {
        console.warn("Using fallback static details on About page.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const activeProfile = profile || fallbackProfile;
  const activeEducation = education.length > 0 ? education : staticEducation;

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Biography</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">About Me</h1>
        </div>

        {/* Bio grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start mb-16">
          <div className="md:col-span-4 flex justify-center">
            <div className="p-2.5 bg-bgCard border border-border rounded-2xl shadow-lg">
              <img
                src={activeProfile.profilePhotoUrl}
                alt={activeProfile.name}
                className="w-56 h-56 object-cover rounded-xl border border-white/5"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80";
                }}
              />
            </div>
          </div>
          <div className="md:col-span-8 flex flex-col gap-6 text-slate-400 dark:text-slate-400">
            <h2 className="text-2xl font-heading font-bold text-white">Engineering Artificial Intelligence</h2>
            <p className="leading-relaxed text-sm sm:text-base">{activeProfile.summary}</p>
            <p className="leading-relaxed text-sm">
              I focus on data engineering pipeline preprocessing, model validation (Scikit-Learn, XGBoost), 
              and full-stack deployment setups. I design backends in FastAPI/Express to deploy ML algorithms 
              as web tools for end-user interaction.
            </p>
          </div>
        </div>

        {/* Dynamic Education Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-heading font-bold text-white mb-8 flex items-center gap-3">
            <i className="fa-solid fa-graduation-cap text-primary"></i> Education History
          </h2>
          <div className="flex flex-col gap-6">
            {activeEducation.map((edu, idx) => (
              <div
                key={edu._id || idx}
                className="p-6 bg-bgCard border border-border hover:border-primary/20 rounded-xl transition-all"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                  <h3 className="text-lg font-heading font-bold text-white">{edu.institution}</h3>
                  <span className="text-xs font-semibold px-3 py-1 bg-slate-900 border border-slate-800 text-primary rounded-full">
                    {edu.duration}
                  </span>
                </div>
                <div className="text-sm font-medium text-slate-300">{edu.degree}</div>
                {edu.score && (
                  <div className="text-xs text-slate-500 mt-2">
                    Academic Grade: <strong className="text-primary/90">{edu.score}</strong>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Grid for Languages and Interests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Languages block */}
          <div className="p-6 bg-bgCard border border-border rounded-xl">
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-language text-primary"></i> Languages
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-slate-400">
              <li className="flex justify-between border-b border-slate-900 pb-1.5">
                <span>Gujarati</span>
                <strong className="text-slate-300 font-medium">Native</strong>
              </li>
              <li className="flex justify-between border-b border-slate-900 pb-1.5">
                <span>Hindi</span>
                <strong className="text-slate-300 font-medium">Native</strong>
              </li>
              <li className="flex justify-between">
                <span>English</span>
                <strong className="text-slate-300 font-medium">Proficient</strong>
              </li>
            </ul>
          </div>

          {/* Interests block */}
          <div className="p-6 bg-bgCard border border-border rounded-xl">
            <h3 className="text-lg font-heading font-bold text-white mb-4 flex items-center gap-2">
              <i className="fa-solid fa-gamepad text-primary"></i> Interests
            </h3>
            <div className="flex flex-wrap gap-2">
              {["AI & Machine Learning", "Cloud Computing", "Startups & Innovation", "Real-world Problem Solving", "Tennis"].map((item, i) => (
                <span
                  key={i}
                  className="bg-slate-950 border border-slate-900 text-slate-400 text-xs px-3 py-1.5 rounded-lg"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
