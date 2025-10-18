// server/src/routes/bookingCourse.routes.js
import { Router } from "express";
import {
  createBooking,
  listBookingsByUser,
  cancelBooking,
} from "../controllers/courseBooking.controller.js";

const router = Router();

router.post("/", createBooking);
router.get("/user/:userId", listBookingsByUser);
router.patch("/:id/cancel", cancelBooking);

export default router;

