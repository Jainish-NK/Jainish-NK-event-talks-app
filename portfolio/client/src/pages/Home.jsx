import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback defaults in case API fails or is loading
  const fallbackProfile = {
    name: "Jainish Khunt",
    title: "AI / ML Engineer & Full-Stack Developer",
    tagline: "Crafting Neural Intelligence & Web Architectures.",
    summary: "AI/ML engineering student actively pursuing a B.Tech and building full-stack web solutions. Experienced in developing machine learning models for early health prediction and agricultural crop production forecasting.",
    profilePhotoUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80",
    resumeUrl: "#",
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, projectsData, skillsData] = await Promise.all([
          api.profile.get(),
          api.projects.getAll(),
          api.skills.getAll(),
        ]);
        setProfile(profileData);
        setProjects(projectsData.filter((p) => p.featured));
        setSkills(skillsData.slice(0, 8)); // Show top 8 on home
      } catch (err) {
        console.warn("API load failed, using local fallback seed data.", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeProfile = profile || fallbackProfile;

  return (
    <div className="min-h-screen bg-bgDark dark:bg-bgDark transition-colors duration-300">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-cyan-500/10 filter blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-indigo-500/10 filter blur-[80px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          {/* Hero Details */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-bold text-sm tracking-widest uppercase mb-4"
            >
              {activeProfile.title}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight text-white dark:text-white leading-[1.1] mb-6"
            >
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">{activeProfile.name}</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-slate-400 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-xl mb-8"
            >
              {activeProfile.tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                to="/projects"
                className="px-6 py-3.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 active:scale-95 text-white font-bold text-sm rounded-lg shadow-lg shadow-cyan-500/20 tracking-wide transition-all"
              >
                View Projects
              </Link>
              <a
                href={activeProfile.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 border border-slate-800 dark:border-border hover:border-primary dark:hover:border-primary hover:bg-primary/5 active:scale-95 text-slate-300 hover:text-primary font-bold text-sm rounded-lg tracking-wide transition-all"
              >
                Download Resume
              </a>
              <Link
                to="/contact"
                className="px-6 py-3.5 text-slate-400 hover:text-white text-sm font-semibold tracking-wide transition-colors"
              >
                Contact Me →
              </Link>
            </motion.div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="p-3 bg-slate-900/40 dark:bg-bgCard/40 border border-slate-900 dark:border-border rounded-3xl shadow-glow animate-float">
                <img
                  src={activeProfile.profilePhotoUrl}
                  alt={activeProfile.name}
                  className="w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-2xl border border-white/5"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About teaser section */}
      <section className="py-20 border-t border-slate-900 dark:border-border bg-slate-950/50">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-3 block">
            About Me
          </span>
          <h2 className="text-3xl font-heading font-extrabold text-white mb-6">
            Engineering Smarter Solutions
          </h2>
          <p className="text-slate-400 dark:text-slate-400 text-lg leading-relaxed mb-8">
            {activeProfile.summary}
          </p>
          <Link
            to="/about"
            className="px-5 py-2.5 bg-slate-900 border border-slate-800 hover:border-primary text-slate-300 hover:text-primary rounded-lg text-sm font-bold tracking-wide transition-all"
          >
            Learn More About Me
          </Link>
        </div>
      </section>

      {/* Featured Projects section */}
      <section className="py-20 border-t border-slate-900 dark:border-border">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">
                Portfolio
              </span>
              <h2 className="text-3xl font-heading font-extrabold text-white">Featured Projects</h2>
            </div>
            <Link to="/projects" className="text-primary hover:text-cyan-400 font-bold text-sm">
              All Projects ({projects.length || 2}) →
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-slate-500 py-12">Retrieving projects...</div>
          ) : projects.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Fallback Static display */}
              <article className="bg-bgCard border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden bg-slate-900">
                  <img src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80" alt="CropYield AI" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-heading font-bold text-white">CropYield AI - Agriculture</h3>
                  <p className="text-sm text-slate-400">Smart Crop Production Predictor based on soil profile and climate parameters.</p>
                  <div className="flex gap-2">
                    <span className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-md text-slate-400">Python</span>
                    <span className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-md text-slate-400">Scikit-Learn</span>
                  </div>
                </div>
              </article>

              <article className="bg-bgCard border border-border rounded-2xl overflow-hidden shadow-lg">
                <div className="h-48 overflow-hidden bg-slate-900">
                  <img src="https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80" alt="LifeLine AI" className="w-full h-full object-cover" />
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <h3 className="text-lg font-heading font-bold text-white">LifeLine AI - Healthcare</h3>
                  <p className="text-sm text-slate-400">Predictive healthcare platform screening Alzheimer's, Diabetes, and Cancer risks.</p>
                  <div className="flex gap-2">
                    <span className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-md text-slate-400">FastAPI</span>
                    <span className="bg-slate-900 border border-slate-800 text-xs px-2.5 py-1 rounded-md text-slate-400">React</span>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((project) => (
                <article
                  key={project._id}
                  className="bg-slate-900/30 dark:bg-bgCard border border-slate-900 dark:border-border hover:border-primary dark:hover:border-primary rounded-2xl overflow-hidden shadow-lg hover:shadow-glow transition-all duration-300"
                >
                  <div className="h-52 overflow-hidden relative">
                    <img
                      src={project.thumbnailImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md border border-white/5 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                      {project.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col gap-3">
                    <h3 className="text-xl font-heading font-bold text-white">{project.title}</h3>
                    <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{project.description}</p>
                    {project.metrics && (
                      <div className="text-xs font-semibold text-primary/90 mt-1">
                        🚀 Performance: {project.metrics}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {project.techStack.map((tech, i) => (
                        <span key={i} className="bg-slate-950/60 dark:bg-slate-950/60 border border-slate-900 dark:border-border text-slate-400 text-[10px] px-2 py-0.5 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
