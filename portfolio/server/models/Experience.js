const mongoose = require("mongoose");

const ExperienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    location: { type: String, default: "" },
    startDate: { type: String, required: true },
    endDate: { type: String, default: "Present" },
    bulletPoints: [{ type: String }],
    companyLogoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", ExperienceSchema);
