// Marina
import express from "express";
import mongoose from "mongoose";
import { getUserBookings } from "../controllers/booking.controller.js";
import { createBooking } from "../controllers/booking.controller.js";
import Booking from "../models/booking.model.js";

const router = express.Router();

// GET all bookings for a user (paginated)
router.get("/", getUserBookings);

// GET a single booking by ID, including cart data
router.get("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//Create new booking
router.post("/newBooking", createBooking);



export default router;
