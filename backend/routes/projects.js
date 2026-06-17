const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET all projects
router.get("/", async (req, res) => {
  try {
    const projects = await db.Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve projects.", error: err.message });
  }
});

// POST a new project
router.post("/", auth, async (req, res) => {
  const { title, description, category, tags, github, live, image, featured } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: "Title, description, and category are required." });
  }

  try {
    const project = await db.Project.create({
      title,
      description,
      category,
      tags: tags || [],
      github: github || "",
      live: live || "",
      image: image || "",
      featured: featured || false,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to create project.", error: err.message });
  }
});

// PUT (update) an existing project
router.put("/:id", auth, async (req, res) => {
  const { title, description, category, tags, github, live, image, featured } = req.body;

  try {
    const project = await db.Project.findByIdAndUpdate(
      req.params.id,
      { title, description, category, tags, github, live, image, featured },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to update project.", error: err.message });
  }
});

// DELETE a project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await db.Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.json({ message: "Project deleted successfully.", project });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project.", error: err.message });
  }
});

module.exports = router;
