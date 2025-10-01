const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/instructor.controller");

// Instructor management
router.get("/", ctrl.listInstructors);
router.post("/", ctrl.createInstructor);
router.put("/:id", ctrl.updateInstructor);
router.patch("/:id/disable", ctrl.disableInstructor);

module.exports = router;
