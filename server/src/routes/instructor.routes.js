import { Router } from "express";
import {
  listInstructors,
  createInstructor,
  updateInstructor,
  disableInstructor,
  getInstructorById,   
} from "../controllers/instructor.controller.js";

const router = Router();

router.get("/", listInstructors);
router.post("/", createInstructor);
router.put("/:id", updateInstructor);
router.patch("/:id/disable", disableInstructor);
router.get("/:id", getInstructorById);

export default router;

