import { Router } from "express";
import { listInstructors, createInstructor, updateInstructor, disableInstructor } 
  from "../controllers/instructor.controller.js";

const router = Router();

router.get("/", listInstructors);
router.post("/", createInstructor);
router.put("/:id", updateInstructor);
router.patch("/:id/disable", disableInstructor);

export default router;

