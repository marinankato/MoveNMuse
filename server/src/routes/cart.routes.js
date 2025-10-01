import express from "express";


import { readCart } from "../controllers/cart.controller.js";
import { removeCartItem} from "../controllers/cart.controller.js"
import { getCartById } from "../controllers/cart.controller.js";


const router = express.Router();

router.get("/", readCart);
// router.get("/", authenticateUser, readCart);
router.get("/:id", getCartById);

router.delete("/item/:itemID", removeCartItem);


// get course details along with its sessions
import Course from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";

router.get("/:courseId/with-sessions", async (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = await Course.findOne({ courseId });
  if (!course) return res.status(404).json({ message: "Course not found" });

  const sessions = await CourseSession.find({ courseId });
  res.json({ course, sessions });
});



export default router;
