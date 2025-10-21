import { Router } from "express";
import {
  listCourseSessions,
  getCourseSession,
  createCourseSession,
  updateCourseSession,
  deleteCourseSession,
  bookSeat,
  cancelSeat,
} from "../controllers/courseSession.controller.js";
import { CourseSession } from "../models/courseSession.model.js"; 

const router = Router();

// ✅ 在这里先定义 /course/:courseId
router.get("/course/:courseId", async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);
    if (Number.isNaN(courseId)) return res.status(400).json({ error: "Invalid courseId" });

    const sessions = await CourseSession.find({ courseId })
      .sort({ startTime: 1 })
      .lean();

    res.json(sessions);
  } catch (e) {
    console.error("getSessionsByCourse error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
});

router.get("/", listCourseSessions);
router.get("/:id", getCourseSession);
router.post("/", createCourseSession);
router.patch("/:id", updateCourseSession);
router.delete("/:id", deleteCourseSession);
router.post("/:id/book", bookSeat);
router.post("/:id/cancel", cancelSeat);

export default router;
