import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ManageProjects from "./pages/ManageProjects";
import ManageSkills from "./pages/ManageSkills";
import ManageExperiences from "./pages/ManageExperiences";
import ManageMessages from "./pages/ManageMessages";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Portfolio Route */}
        <Route path="/" element={<Home />} />

        {/* Admin CMS Authentication */}
        <Route path="/admin/login" element={<Login />} />

        {/* CMS Dashboard & Management Console */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/projects" element={<ManageProjects />} />
        <Route path="/admin/skills" element={<ManageSkills />} />
        <Route path="/admin/experiences" element={<ManageExperiences />} />
        <Route path="/admin/messages" element={<ManageMessages />} />
      </Routes>
    </Router>
  );
}
