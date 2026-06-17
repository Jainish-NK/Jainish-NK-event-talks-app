const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    techStack: [{ type: String }],
    liveDemoUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    apiDocsUrl: { type: String, default: "" },
    thumbnailImageUrl: { type: String, default: "" },
    gallery: [{ type: String }],
    featured: { type: Boolean, default: false },
    metrics: { type: String, default: "" }, // e.g. "96.49% R Score"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
