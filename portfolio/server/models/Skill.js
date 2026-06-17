const mongoose = require("mongoose");

const SkillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true }, // e.g. "Languages & Tools", "AI / Machine Learning", "Data Science", "Backend & Deployment"
    name: { type: String, required: true },
    level: { type: Number, default: 80 },       // Optional 0 - 100 level
    iconName: { type: String, default: "" },    // FontAwesome class name
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", SkillSchema);
