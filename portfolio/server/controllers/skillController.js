const Skill = require("../models/Skill");

// GET all skills
exports.getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve skills.", error: error.message });
  }
};

// CREATE a skill
exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (error) {
    res.status(500).json({ message: "Failed to create skill.", error: error.message });
  }
};

// UPDATE a skill
exports.updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.json(skill);
  } catch (error) {
    res.status(500).json({ message: "Failed to update skill.", error: error.message });
  }
};

// DELETE a skill
exports.deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndDelete(req.params.id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }
    res.json({ message: "Skill deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete skill.", error: error.message });
  }
};
