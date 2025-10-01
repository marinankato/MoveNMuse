const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/course.controller");

// If you have auth middleware, uncomment these lines
// const { requireAuth, requireRole } = require("../middlewares/auth.middleware");

// Course browsing
router.get("/", ctrl.listCourses);        // List all courses (supports filter/search)
router.get("/:id", ctrl.getCourse);       // View course details

//  Course management (for admin/staff use)
router.post(
  "/",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.createCourse
);

router.put(
  "/:id",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.updateCourse   // Update course
);

router.delete(
  "/:id",
  // requireAuth, requireRole(["admin", "staff"]),
  ctrl.deleteCourse
);

module.exports = router;


