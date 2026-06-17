import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  const staticSkills = [
    { name: "Python", category: "Languages & Tools", level: 90, iconName: "fa-brands fa-python" },
    { name: "JavaScript", category: "Languages & Tools", level: 85, iconName: "fa-brands fa-js" },
    { name: "Scikit-Learn", category: "AI / Machine Learning", level: 85, iconName: "fa-solid fa-brain" },
    { name: "XGBoost", category: "AI / Machine Learning", level: 80, iconName: "fa-solid fa-bolt" },
    { name: "NumPy & Pandas", category: "Data Science", level: 90, iconName: "fa-solid fa-table" },
    { name: "FastAPI", category: "Backend & Deployment", level: 85, iconName: "fa-solid fa-bolt" },
    { name: "Node.js & Express", category: "Backend & Deployment", level: 80, iconName: "fa-brands fa-node-js" }
  ];

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await api.skills.getAll();
        setSkills(data);
      } catch (err) {
        console.warn("Using local fallback data in Skills section.");
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  const activeSkills = skills.length > 0 ? skills : staticSkills;

  // Group by category
  const skillsByCategory = activeSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(skillsByCategory);

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Catalog</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">Technical Skills</h1>
        </div>

        {loading && skills.length === 0 ? (
          <div className="text-center text-slate-500 py-12">Retrieving skills matrix...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((cat, catIdx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: catIdx * 0.1 }}
                className="p-6 bg-bgCard border border-border rounded-2xl shadow-lg"
              >
                <h2 className="text-xl font-heading font-bold text-white border-b border-slate-900 pb-3 mb-6 flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]"></span>
                  {cat}
                </h2>
                
                <div className="flex flex-col gap-5">
                  {skillsByCategory[cat].map((skill) => (
                    <div key={skill._id || skill.name} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center text-sm font-semibold">
                        <span className="text-slate-300 flex items-center gap-2">
                          {skill.iconName ? (
                            <i className={`${skill.iconName} text-primary w-4 text-center`}></i>
                          ) : (
                            <i className="fa-solid fa-code text-primary w-4 text-center"></i>
                          )}
                          {skill.name}
                        </span>
                        <span className="text-primary">{skill.level}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                  ))}
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
