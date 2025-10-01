import { Router } from "express";
import { createBooking, listBookingsByUser, cancelBooking } from "../controllers/bookingCourse.controller.js";

const router = Router();

router.post("/", createBooking);                     // create a booking
router.get("/user/:userId", listBookingsByUser);     // list bookings for a user
router.patch("/:id/cancel", cancelBooking);          // cancel a booking

export default router;
