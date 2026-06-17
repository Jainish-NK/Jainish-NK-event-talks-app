const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/upload");

// Setup multiple file fields
const profileFieldsUpload = upload.fields([
  { name: "profilePhoto", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

router.get("/", profileController.getProfile);
router.put("/", auth, profileFieldsUpload, profileController.updateProfile);

module.exports = router;
