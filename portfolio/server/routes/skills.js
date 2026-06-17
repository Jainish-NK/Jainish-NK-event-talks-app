const express = require("express");
const router = express.Router();
const skillController = require("../controllers/skillController");
const auth = require("../middleware/auth");

router.get("/", skillController.getAllSkills);
router.post("/", auth, skillController.createSkill);
router.put("/:id", auth, skillController.updateSkill);
router.delete("/:id", skillController.deleteSkill);

module.exports = router;
