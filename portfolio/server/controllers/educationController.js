const Education = require("../models/Education");

// GET all education
exports.getAllEducation = async (req, res) => {
  try {
    const education = await Education.find().sort({ duration: -1 });
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve education list.", error: error.message });
  }
};

// CREATE education entry
exports.createEducation = async (req, res) => {
  try {
    const education = await Education.create(req.body);
    res.status(201).json(education);
  } catch (error) {
    res.status(500).json({ message: "Failed to save education entry.", error: error.message });
  }
};

// UPDATE education entry
exports.updateEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!education) {
      return res.status(404).json({ message: "Education entry not found." });
    }
    res.json(education);
  } catch (error) {
    res.status(500).json({ message: "Failed to update education entry.", error: error.message });
  }
};

// DELETE education entry
exports.deleteEducation = async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: "Education entry not found." });
    }
    res.json({ message: "Education entry deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete education entry.", error: error.message });
  }
};
