const express = require("express");
const router = express.Router();
const educationController = require("../controllers/educationController");
const auth = require("../middleware/auth");

router.get("/", educationController.getAllEducation);
router.post("/", auth, educationController.createEducation);
router.put("/:id", auth, educationController.updateEducation);
router.delete("/:id", auth, educationController.deleteEducation);

module.exports = router;
