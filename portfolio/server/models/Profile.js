const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    summary: { type: String, required: true },
    profilePhotoUrl: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", ProfileSchema);
