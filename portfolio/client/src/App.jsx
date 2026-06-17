import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useThemeStore from "./store/useThemeStore";

// Public Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Experience from "./pages/Experience";
import Projects from "./pages/Projects";
import Certifications from "./pages/Certifications";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Admin Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import ManageSkills from "./pages/ManageSkills";
import ManageExperiences from "./pages/ManageExperiences";
import ManageProjects from "./pages/ManageProjects";
import ManageCertifications from "./pages/ManageCertifications";
import ManageEducation from "./pages/ManageEducation";
import ManageMessages from "./pages/ManageMessages";

export default function App() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/contact" element={<Contact />} />

        {/* CMS login authentication */}
        <Route path="/admin/login" element={<Login />} />

        {/* Protected CMS Admin Console routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/skills" element={<ManageSkills />} />
        <Route path="/admin/experience" element={<ManageExperiences />} />
        <Route path="/admin/projects" element={<ManageProjects />} />
        <Route path="/admin/certifications" element={<ManageCertifications />} />
        <Route path="/admin/education" element={<ManageEducation />} />
        <Route path="/admin/messages" element={<ManageMessages />} />

        {/* 404 Wildcard redirect */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
