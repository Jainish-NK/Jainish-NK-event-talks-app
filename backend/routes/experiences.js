const express = require("express");
const router = express.Router();
const db = require("../config/db");
const auth = require("../middleware/auth");

// GET all experiences
router.get("/", async (req, res) => {
  try {
    const experiences = await db.Experience.find();
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve experiences.", error: err.message });
  }
});

// POST a new experience
router.post("/", auth, async (req, res) => {
  const { role, company, duration, description } = req.body;

  if (!role || !company || !duration || !description) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const experience = await db.Experience.create({ role, company, duration, description });
    res.status(201).json(experience);
  } catch (err) {
    res.status(500).json({ message: "Failed to create experience.", error: err.message });
  }
});

// PUT (update) an existing experience
router.put("/:id", auth, async (req, res) => {
  const { role, company, duration, description } = req.body;

  try {
    const experience = await db.Experience.findByIdAndUpdate(
      req.params.id,
      { role, company, duration, description },
      { new: true }
    );
    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }
    res.json(experience);
  } catch (err) {
    res.status(500).json({ message: "Failed to update experience.", error: err.message });
  }
});

// DELETE an experience
router.delete("/:id", auth, async (req, res) => {
  try {
    const experience = await db.Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }
    res.json({ message: "Experience deleted successfully.", experience });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete experience.", error: err.message });
  }
});

module.exports = router;
