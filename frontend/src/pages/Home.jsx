import React, { useState, useEffect } from "react";
import { api } from "../utils/api";
import Toast from "../components/Toast";

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [activeFilter, setActiveFilter] = useState("All");

  // Contact form state
  const [contactData, setContactData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [projRes, skillRes, expRes] = await Promise.all([
          api.projects.getAll(),
          api.skills.getAll(),
          api.experiences.getAll(),
        ]);
        setProjects(projRes);
        setSkills(skillRes);
        setExperiences(expRes);
      } catch (err) {
        console.error("Failed to load portfolio details from backend API:", err);
        showToast("Error loading latest data. Showing fallback details.", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.email || !contactData.message) {
      showToast("Please fill out all required fields.", "error");
      return;
    }

    setSubmitLoading(true);
    try {
      await api.messages.submit(contactData);
      showToast("Message sent successfully! I will get back to you shortly.");
      setContactData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      showToast(err.message || "Failed to send message.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Get distinct categories
  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  // Filtered projects
  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div>
      {/* Toast Overlays */}
      <div className="toast-overlay">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      {/* Navigation Header */}
      <header className="site-header">
        <div className="container nav-container">
          <a href="#" className="logo-brand">
            Jainish Khunt<span>.</span>
          </a>
          <nav>
            <ul className="nav-links">
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#projects" className="nav-link">Projects</a></li>
              <li><a href="#skills" className="nav-link">Skills</a></li>
              <li><a href="#experience" className="nav-link">Timeline</a></li>
              <li><a href="#contact" className="nav-link">Contact</a></li>
              <li>
                <a href="/admin/login" className="btn-secondary" style={{ fontSize: "0.8rem", padding: "6px 12px" }}>
                  CMS Access
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section id="about" className="hero-section">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        <div className="container hero-grid">
          <div>
            <span className="hero-tagline">AI/ML Engineering Student</span>
            <h1 className="hero-title">
              Crafting Neural Intelligence & <span>Web Architectures.</span>
            </h1>
            <p className="hero-desc">
              I design optimized deep learning algorithms and build production-ready 
              full-stack applications. Actively looking for internships and engineering roles 
              to deploy scalable solutions.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn-primary">Get In Touch</a>
              <a href="#projects" className="btn-outline">View My Work</a>
            </div>
          </div>
          <div className="hero-img-wrapper">
            <div className="hero-img-border">
              <img
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80"
                alt="Jainish Khunt Portrait"
                className="hero-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="section-padding" style={{ backgroundColor: "#060913" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Selected Work</span>
            <h2 className="section-title">Featured Projects</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              Loading Projects...
            </div>
          ) : (
            <>
              {/* Category Filter Bar */}
              <div className="filter-bar">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`filter-btn ${activeFilter === cat ? "active" : ""}`}
                    onClick={() => setActiveFilter(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              <div className="projects-grid">
                {filteredProjects.map((project) => (
                  <article key={project._id} className="project-card">
                    <div className="project-img-container">
                      <img
                        src={project.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                        alt={project.title}
                        className="project-img"
                      />
                      <span className="project-category-tag">{project.category}</span>
                    </div>
                    <div className="project-content">
                      <h3 className="project-title">{project.title}</h3>
                      <p className="project-desc">{project.description}</p>
                      <div className="project-tags">
                        {project.tags.map((t, i) => (
                          <span key={i} className="project-tag">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="project-links">
                        {project.github && (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            <i className="fa-brands fa-github"></i> GitHub
                          </a>
                        )}
                        {project.live && (
                          <a
                            href={project.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="project-link"
                          >
                            <i className="fa-solid fa-arrow-up-right-from-square"></i> Live Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Proficiencies</span>
            <h2 className="section-title">Technical Expertise</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              Loading Skills...
            </div>
          ) : (
            <div className="skills-container">
              {Object.keys(skillsByCategory).map((cat) => (
                <div key={cat} className="skills-column">
                  <h3 className="skills-column-title">{cat}</h3>
                  <div className="skills-list">
                    {skillsByCategory[cat].map((skill) => (
                      <div key={skill._id} className="skill-item">
                        <div className="skill-info">
                          <span className="skill-name">{skill.name}</span>
                          <span className="skill-level-text">{skill.level}%</span>
                        </div>
                        <div className="skill-bar-wrapper">
                          <div
                            className="skill-bar-progress"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="experience" className="section-padding" style={{ backgroundColor: "#060913" }}>
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Journey</span>
            <h2 className="section-title">Education & Timeline</h2>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", color: "var(--text-secondary)" }}>
              Loading Timeline...
            </div>
          ) : (
            <div className="timeline">
              {experiences.map((exp) => (
                <div key={exp._id} className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <span className="timeline-duration">{exp.duration}</span>
                    <h3 className="timeline-role">{exp.role}</h3>
                    <h4 className="timeline-company">{exp.company}</h4>
                    <p className="timeline-desc">{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section-padding">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">Connect</span>
            <h2 className="section-title">Get In Touch</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info-block">
              <div className="contact-card">
                <div className="contact-icon-bg">
                  <i className="fa-solid fa-envelope"></i>
                </div>
                <div>
                  <span className="contact-label">Email</span>
                  <div className="contact-val">jainish.khunt@example.com</div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon-bg">
                  <i className="fa-solid fa-location-dot"></i>
                </div>
                <div>
                  <span className="contact-label">Location</span>
                  <div className="contact-val">Sunnyvale, CA</div>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-icon-bg">
                  <i className="fa-brands fa-linkedin"></i>
                </div>
                <div>
                  <span className="contact-label">LinkedIn</span>
                  <div className="contact-val">
                    <a
                      href="https://linkedin.com/in/jainish-khunt"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--primary)" }}
                    >
                      linkedin.com/in/jainish-khunt
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleContactSubmit} className="contact-form">
              <div className="form-group-row">
                <div className="form-input-wrapper">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={contactData.name}
                    onChange={(e) =>
                      setContactData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-input-wrapper">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={contactData.email}
                    onChange={(e) =>
                      setContactData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              <div className="form-input-wrapper">
                <label className="form-label">Subject</label>
                <input
                  type="text"
                  className="form-input"
                  value={contactData.subject}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="Opportunity Description"
                />
              </div>

              <div className="form-input-wrapper">
                <label className="form-label">Your Message *</label>
                <textarea
                  className="form-input"
                  value={contactData.message}
                  onChange={(e) =>
                    setContactData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Hi Jainish, I'd like to discuss an AI/ML internship role..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" disabled={submitLoading}>
                {submitLoading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container">
          <p>© 2026 Jainish Khunt. All rights reserved. MERN Dynamic Portfolio Project.</p>
        </div>
      </footer>
    </div>
  );
}
