const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await db.Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve skills.", error: err.message });
  }
});

// POST a new skill
router.post("/", auth, async (req, res) => {
  const { name, category, level } = req.body;

  if (!name || !category || level === undefined) {
    return res.status(400).json({ message: "Name, category, and level are required." });
  }

  try {
    const skill = await db.Skill.create({ name, category, level: Number(level) });
    res.status(201).json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to create skill.", error: err.message });
  }
});

// PUT (update) an existing skill
router.put("/:id", auth, async (req, res) => {
  const { name, category, level } = req.body;

  try {
    const skill = await db.Skill.findByIdAndUpdate(
      req.params.id,
      { name, category, level: level !== undefined ? Number(level) : undefined },
      { new: true }
    );
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.json(skill);
  } catch (err) {
    res.status(500).json({ message: "Failed to update skill.", error: err.message });
  }
});

// DELETE a skill
router.delete("/:id", auth, async (req, res) => {
  try {
    const skill = await db.Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.json({ message: "Skill deleted successfully.", skill });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete skill.", error: err.message });
  }
});

module.exports = router;
