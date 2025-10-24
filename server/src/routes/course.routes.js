// server/src/routes/course.routes.js
import { Router } from "express";
import {
  listCourses,
  listOpenCourses,
  getCourse,
  createCourse,
  deleteCourse,
  updateCourse,
} from "../controllers/course.controller.js";
import { authMiddleware, requireRole } from "../middlewares/auth.middleware.js";
const router = Router();

// static open courses for all users (no auth)
router.get("/open", listOpenCourses);

// list all courses
router.get("/", listCourses);

// get course details (match only numbers or 24-character ObjectId to avoid catching /open)
router.get("/:id([0-9]+|[a-fA-F0-9]{24})", getCourse);

// create/delete
router.post("/", createCourse);
router.delete("/:id([0-9]+|[a-fA-F0-9]{24})", deleteCourse);

router.put(
  "/:id([0-9]+|[a-fA-F0-9]{24})",
  authMiddleware,
  requireRole("staff"),
  updateCourse
);

export default router;
