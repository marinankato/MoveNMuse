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

const router = Router();

router.get("/", listCourseSessions);
router.get("/:id", getCourseSession);           // support both ObjectId and numeric sessionId
router.post("/", createCourseSession);
router.patch("/:id", updateCourseSession);
router.delete("/:id", deleteCourseSession);

// concurrency-safe seat booking and cancellation
router.post("/:id/book", bookSeat);
router.post("/:id/cancel", cancelSeat);

export default router;
