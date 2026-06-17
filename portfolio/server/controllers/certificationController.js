const Certification = require("../models/Certification");

// GET all certifications
exports.getAllCertifications = async (req, res) => {
  try {
    const certifications = await Certification.find().sort({ createdAt: -1 });
    res.json(certifications);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve certifications.", error: error.message });
  }
};

// CREATE a certification
exports.createCertification = async (req, res) => {
  try {
    const certification = await Certification.create(req.body);
    res.status(201).json(certification);
  } catch (error) {
    res.status(500).json({ message: "Failed to save certification.", error: error.message });
  }
};

// UPDATE a certification
exports.updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!certification) {
      return res.status(404).json({ message: "Certification not found." });
    }
    res.json(certification);
  } catch (error) {
    res.status(500).json({ message: "Failed to update certification.", error: error.message });
  }
};

// DELETE a certification
exports.deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: "Certification not found." });
    }
    res.json({ message: "Certification deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete certification.", error: error.message });
  }
};
