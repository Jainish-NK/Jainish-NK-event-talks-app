const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experienceController");
const auth = require("../middleware/auth");

router.get("/", experienceController.getAllExperiences);
router.post("/", auth, experienceController.createExperience);
router.put("/:id", auth, experienceController.updateExperience);
router.delete("/:id", auth, experienceController.deleteExperience);

module.exports = router;
