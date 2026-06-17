const mongoose = require("mongoose");

const EducationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    duration: { type: String, required: true },
    score: { type: String, default: "" }, // CGPA or percentage
    level: { type: String, enum: ["school", "college"], default: "college" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Education", EducationSchema);
