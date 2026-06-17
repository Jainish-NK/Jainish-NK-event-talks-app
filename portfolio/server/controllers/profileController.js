const Profile = require("../models/Profile");
const { uploadToCloudinary } = require("../middleware/upload");

// GET profile
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Default fallback profile if not seeded
      profile = await Profile.create({
        name: "Jainish Khunt",
        title: "AI / ML Engineer & Full-Stack Developer",
        tagline: "Crafting Neural Intelligence & Web Architectures.",
        summary: "AI/ML engineering student actively pursuing a B.Tech and building full-stack web solutions.",
        profilePhotoUrl: "",
        resumeUrl: "",
      });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve profile.", error: error.message });
  }
};

// UPDATE profile
exports.updateProfile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle uploaded files
    if (req.files) {
      if (req.files.profilePhoto) {
        const localPath = req.files.profilePhoto[0].path;
        const cloudUrl = await uploadToCloudinary(localPath);
        // If Cloudinary succeeds, use it; otherwise, use local static server URL
        updateData.profilePhotoUrl = cloudUrl || `/uploads/${req.files.profilePhoto[0].filename}`;
      }
      if (req.files.resume) {
        const localPath = req.files.resume[0].path;
        const cloudUrl = await uploadToCloudinary(localPath);
        updateData.resumeUrl = cloudUrl || `/uploads/${req.files.resume[0].filename}`;
      }
    }

    const profile = await Profile.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile.", error: error.message });
  }
};
