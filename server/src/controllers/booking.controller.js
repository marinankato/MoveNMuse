import Booking from "../models/booking.model.js";
import mongoose from "mongoose";

export const getUserBookings = async (req, res) => {
  const { userId, page = 1, limit = 5 } = req.query;

  try {
    const objectUserId = new mongoose.Types.ObjectId(String(userId));

    const bookings = await Booking.find({ user: objectUserId })
    .sort({ bookingDate: -1 }) // optional sorting  
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

    const total = await Booking.countDocuments({ user: objectUserId });

    res.json({
      bookings,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

