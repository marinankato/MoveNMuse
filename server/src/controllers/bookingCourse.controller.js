// server/src/controllers/bookingCourse.controller.js
import mongoose from "mongoose";
import BookingCourse from "../models/bookingCourse.model.js";
import Course from "../models/course.model.js";

/** POST /api/bookings  body: { userId, courseId } */
export const createBooking = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ error: "Invalid userId or courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // check if course is full
    const bookedCount = await BookingCourse.countDocuments({
      course: courseId,
      status: "CONFIRMED",
    });

    if (bookedCount >= (course.capacity || 0)) {
      return res.status(400).json({ error: "Course is full" });
    }

    const booking = await BookingCourse.create({ userId, course: courseId, status: "CONFIRMED" });
    return res.status(201).json({ id: booking._id, message: "Booking confirmed" });
  } catch (e) {
    console.error("createBooking error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

/** GET /api/bookings/user/:userId */
export const listBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const bookings = await BookingCourse.find({ userId })
      .populate("course", "name category startAt endAt instructor")
      .lean();

    return res.json(bookings);
  } catch (e) {
    console.error("listBookingsByUser error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

/** PATCH /api/bookings/:id/cancel */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    const booking = await BookingCourse.findByIdAndUpdate(
      id,
      { status: "CANCELLED" },
      { new: true }
    );

    if (!booking) return res.status(404).json({ error: "Booking not found" });
    return res.json({ message: "Booking cancelled", booking });
  } catch (e) {
    console.error("cancelBooking error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

// Below is the code of d:\Desktop\MoveNMuse\server\src\controllers\course.controller.js 
// export default { createBooking, listBookingsByUser, cancelBooking };

