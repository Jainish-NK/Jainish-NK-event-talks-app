import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [ghRepos, setGhRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Modal State
  const [selectedProject, setSelectedProject] = useState(null);

  const staticProjects = [
    {
      _id: "seed_projects_0",
      title: "CropYield AI - Smart Crop Production Predictor",
      description: "AI-powered platform predicting agricultural crop yields based on soil parameters.",
      longDescription: "An AI-driven solution tailored for precision agriculture. Using parameters like soil profile (N, P, K), rainfall, temperature, and region, it outputs recommendations for ideal crop choices and predicts estimated yields using regression algorithms. Aims to minimize crop failures and optimize harvesting outputs.",
      category: "Machine Learning",
      techStack: ["Python", "Pandas", "Scikit-Learn", "FastAPI", "React.js"],
      githubUrl: "https://github.com/Jainish-NK",
      liveDemoUrl: "https://github.com/Jainish-NK",
      thumbnailImageUrl: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
      gallery: ["https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80"],
      featured: true,
      metrics: "96.49% R² Score"
    },
    {
      _id: "seed_projects_1",
      title: "LifeLine AI - Health Prediction System",
      description: "Multi-disease healthcare platform predicting risks across Alzheimer's, Diabetes, and Cancer.",
      longDescription: "A smart health assessment engine designed to predict medical condition risks using machine learning classification algorithms. Recruits disease-specific physiological markers to compute early risk profiles, saving user screening reports on Firebase Cloud Storage for instant analysis. Supports Alzheimer's, Diabetes, and Cancer datasets.",
      category: "Machine Learning",
      techStack: ["Python", "Scikit-Learn", "FastAPI", "Firebase", "React.js", "Zustand"],
      githubUrl: "https://github.com/Jainish-NK",
      liveDemoUrl: "https://github.com/Jainish-NK",
      thumbnailImageUrl: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
      gallery: ["https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80"],
      featured: true,
      metrics: "Early Screening ML Models"
    }
  ];

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await api.projects.getAll();
        setProjects(data);
      } catch (err) {
        console.warn("Using fallback static project list.");
      } finally {
        setLoading(false);
      }
    };

    const fetchGitHubRepos = async () => {
      try {
        const cached = localStorage.getItem("gh_repos_list");
        const cachedTime = localStorage.getItem("gh_repos_time");

        // Use cache if under 30 minutes old to prevent rate limits
        if (cached && cachedTime && (Date.now() - Number(cachedTime) < 30 * 60 * 1000)) {
          setGhRepos(JSON.parse(cached));
          return;
        }

        const res = await axios.get("https://api.github.com/users/Jainish-NK/repos");
        const repos = res.data.map((repo) => ({
          name: repo.name,
          description: repo.description || "No description provided.",
          language: repo.language || "JavaScript",
          stars: repo.stargazers_count,
          updatedAt: repo.updated_at,
          htmlUrl: repo.html_url,
        }));

        // Sort by stars/updates
        repos.sort((a, b) => b.stars - a.stars || new Date(b.updatedAt) - new Date(a.updatedAt));
        const sliceRepos = repos.slice(0, 6); // Top 6

        setGhRepos(sliceRepos);
        localStorage.setItem("gh_repos_list", JSON.stringify(sliceRepos));
        localStorage.setItem("gh_repos_time", Date.now().toString());
      } catch (error) {
        console.warn("Could not retrieve github repositories:", error.message);
      }
    };

    loadProjects();
    fetchGitHubRepos();
  }, []);

  const activeProjects = projects.length > 0 ? projects : staticProjects;
  const categories = ["All", ...new Set(activeProjects.map((p) => p.category))];

  const filtered =
    activeFilter === "All"
      ? activeProjects
      : activeProjects.filter((p) => p.category === activeFilter);

  return (
    <div className="min-h-screen bg-bgDark">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">Projects</span>
          <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-white">Portfolio Catalog</h1>
        </div>

        {/* Filter bar */}
        <div className="flex justify-center gap-3 mb-10 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-full border transition-all ${
                activeFilter === cat
                  ? "bg-primary/10 border-primary text-primary shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
          <div className="text-center text-slate-500 py-12">Retrieving projects...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filtered.map((project) => (
              <article
                key={project._id}
                onClick={() => setSelectedProject(project)}
                className="bg-bgCard border border-border hover:border-primary/30 rounded-2xl overflow-hidden shadow-lg hover:shadow-glow cursor-pointer transition-all duration-300 flex flex-col h-full"
              >
                <div className="h-48 overflow-hidden relative bg-slate-950">
                  <img
                    src={project.thumbnailImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/5 uppercase">
                    {project.category}
                  </span>
                </div>
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <h3 className="text-lg font-heading font-bold text-white line-clamp-1">{project.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed flex-1">{project.description}</p>
                  {project.metrics && (
                    <span className="text-[11px] font-semibold text-primary/80 mt-1">
                      📈 {project.metrics}
                    </span>
                  )}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="bg-slate-950 text-slate-400 text-[9px] px-2 py-0.5 rounded border border-slate-900">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* GitHub Repositories live section */}
        {ghRepos.length > 0 && (
          <section className="border-t border-slate-900 dark:border-border pt-16">
            <h2 className="text-2xl font-heading font-bold text-white mb-3 text-center">Open Source Repositories</h2>
            <p className="text-slate-400 text-sm text-center mb-10">Live updates fetched from my GitHub profile</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ghRepos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 bg-bgCard border border-border hover:border-primary/20 rounded-xl transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-heading font-bold text-white text-base hover:text-primary transition-colors flex items-center gap-2">
                      <i className="fa-brands fa-github text-primary text-lg"></i>
                      {repo.name}
                    </h3>
                    {repo.stars > 0 && (
                      <span className="text-xs text-yellow-400 flex items-center gap-1 font-semibold">
                        <i className="fa-solid fa-star"></i> {repo.stars}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed flex-1">{repo.description}</p>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold border-t border-slate-900 pt-3 mt-1">
                    <span>Codebase: {repo.language}</span>
                    <span>Updated: {new Date(repo.updatedAt).toLocaleDateString()}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Modal Detail Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-bgCard border border-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]"
            >
              {/* Close icon */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-950/80 backdrop-blur border border-white/5 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* Cover */}
              <div className="h-60 sm:h-72 overflow-hidden relative shrink-0">
                <img
                  src={selectedProject.thumbnailImageUrl || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md text-primary text-xs font-bold px-3 py-1.5 rounded-full border border-white/5">
                  {selectedProject.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                <h2 className="text-2xl font-heading font-bold text-white">{selectedProject.title}</h2>
                
                {selectedProject.metrics && (
                  <div className="text-xs font-semibold text-primary py-1.5 px-3 bg-primary/5 border border-primary/15 rounded-lg w-fit">
                    📈 Metrics: {selectedProject.metrics}
                  </div>
                )}

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProject.longDescription || selectedProject.description}
                </p>

                {/* Tech Badges */}
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Tech Stack</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProject.techStack.map((tech, i) => (
                      <span key={i} className="bg-slate-950 border border-slate-900 text-slate-400 text-xs px-2.5 py-1 rounded-md">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* External links */}
                <div className="flex gap-4 border-t border-slate-900 pt-4 mt-2">
                  {selectedProject.githubUrl && (
                    <a
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-900 border border-slate-800 hover:border-primary text-slate-300 hover:text-primary rounded-lg text-sm font-semibold transition-all"
                    >
                      <i className="fa-brands fa-github text-base"></i> View Repository
                    </a>
                  )}
                  {selectedProject.liveDemoUrl && (
                    <a
                      href={selectedProject.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-lg text-sm font-bold shadow-lg transition-all"
                    >
                      <i className="fa-solid fa-arrow-up-right-from-square text-sm"></i> Launch Demo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
