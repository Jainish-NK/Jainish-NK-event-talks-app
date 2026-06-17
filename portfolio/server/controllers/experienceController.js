const Experience = require("../models/Experience");

// GET all experiences
exports.getAllExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve experience items.", error: error.message });
  }
};

// CREATE experience
exports.createExperience = async (req, res) => {
  try {
    const expData = { ...req.body };
    if (typeof expData.bulletPoints === "string") {
      expData.bulletPoints = expData.bulletPoints.split("\n").map(b => b.trim()).filter(Boolean);
    }
    const experience = await Experience.create(expData);
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Failed to create experience.", error: error.message });
  }
};

// UPDATE experience
exports.updateExperience = async (req, res) => {
  try {
    const expData = { ...req.body };
    if (typeof expData.bulletPoints === "string") {
      expData.bulletPoints = expData.bulletPoints.split("\n").map(b => b.trim()).filter(Boolean);
    }
    const experience = await Experience.findByIdAndUpdate(req.params.id, expData, { new: true });
    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Failed to update experience.", error: error.message });
  }
};

// DELETE experience
exports.deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found." });
    }
    res.json({ message: "Experience deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete experience.", error: error.message });
  }
};
