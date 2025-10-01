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

export const createBooking = async (req, res) => {
  try {
    const { userId, items, orderDate, orderTotal, status } = req.body || {};

    if (!userId || !items || !orderDate || !orderTotal || !status) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    const lastBooking = await Booking.findOne().sort({ orderId: -1 });
    const newOrderId = lastBooking ? lastBooking.orderId + 1 : 1;
    const newBooking = new Booking({
      userId: userId,
      items,
      orderId: newOrderId,
      orderDate: orderDate,
      orderTotal: orderTotal,
      status,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created", booking: newBooking });  
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
}
