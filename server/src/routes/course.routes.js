// server/src/routes/course.routes.js
import { Router } from "express";
import { listCourses, getCourse, createCourse, deleteCourse } from "../controllers/course.controller.js";

const router = Router();
router.get("/", listCourses);
router.get("/:id", getCourse);
router.post("/", createCourse);
router.delete("/:id", deleteCourse);

export default router;



