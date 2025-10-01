import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  createBooking,
  listBookingsByUser,
  cancelBooking,
} from "../controllers/bookingCourse.controller.js";

const router = Router();

router.post("/", verifyToken, createBooking);
router.get("/user/:userId", verifyToken, listBookingsByUser);
router.patch("/:id/cancel", verifyToken, cancelBooking);

export default router;



