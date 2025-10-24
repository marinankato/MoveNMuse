// Marina
import Booking from "../models/booking.model.js";

export const getUserBookings = async (req, res) => {
  let { userId, page = 1, limit = 5, sortBy = "newest" } = req.query;

  try {
    userId = parseInt(userId, 10);
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid or missing userId" });
    }

    // Determine sort order
    let sortObj;
    switch (sortBy) {
      case "oldest":
        sortObj = { orderDate: 1, _id: 1 }; // oldest first
        break;
      case "priceHigh":
        sortObj = { orderTotal: -1, _id: -1 }; // highest total first
        break;
      case "priceLow":
        sortObj = { orderTotal: 1, _id: 1 }; // lowest total first
        break;
      case "newest":
      default:
        sortObj = { orderDate: -1, _id: -1 }; // newest first
        break;
    }

    const bookings = await Booking.find({ userId })
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Booking.countDocuments({ userId });

    res.json({ bookings, total, page, limit });
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ message: "Failed to fetch bookings." });
  }
};

// POST /api/bookings
export const createBooking = async (req, res) => {
  let { userId, items, orderDate, orderTotal, status } = req.body || {};

  try {
    userId = parseInt(userId, 10);

    if (
      isNaN(userId) ||
      !Array.isArray(items) ||
      !orderDate ||
      typeof orderTotal !== "number" ||
      !status
    ) {
      return res.status(400).json({ message: "Missing or invalid fields" });
    }

    const lastBooking = await Booking.findOne().sort({ orderId: -1 });
    const newOrderId = lastBooking ? lastBooking.orderId + 1 : 1;

    const newBooking = new Booking({
      userId,
      items,
      orderId: newOrderId,
      orderDate,
      orderTotal,
      status,
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created",
      booking: newBooking,
    });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ message: "Server error" });
  }
};
