const Project = require("../models/Project");
const { uploadToCloudinary } = require("../middleware/upload");

// GET all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ featured: -1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve projects.", error: error.message });
  }
};

// CREATE a project
exports.createProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Parse arrays
    if (typeof projectData.techStack === "string") {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }
    if (typeof projectData.gallery === "string") {
      projectData.gallery = projectData.gallery
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Handle thumbnail image upload
    if (req.file) {
      const cloudUrl = await uploadToCloudinary(req.file.path);
      projectData.thumbnailImageUrl = cloudUrl || `/uploads/${req.file.filename}`;
    }

    const project = await Project.create(projectData);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to create project.", error: error.message });
  }
};

// UPDATE a project
exports.updateProject = async (req, res) => {
  try {
    const projectData = { ...req.body };

    // Parse arrays
    if (typeof projectData.techStack === "string") {
      projectData.techStack = projectData.techStack
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(projectData.techStack)) {
      // Keep it as array if parsed by frontend
    }

    if (typeof projectData.gallery === "string") {
      projectData.gallery = projectData.gallery
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    // Handle thumbnail image upload
    if (req.file) {
      const cloudUrl = await uploadToCloudinary(req.file.path);
      projectData.thumbnailImageUrl = cloudUrl || `/uploads/${req.file.filename}`;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Failed to update project.", error: error.message });
  }
};

// DELETE a project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    res.json({ message: "Project deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete project.", error: error.message });
  }
};
