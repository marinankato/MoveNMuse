// server/src/controllers/bookingCourse.controller.js
import mongoose from "mongoose";
import BookingCourse from "../models/bookingCourse.model.js";
import Course from "../models/course.model.js";

/** POST /api/bookings  body: { courseId } */
export const createBooking = async (req, res) => {
  try {

    const currentUserId = req.user?.fid || req.user?._id;
    let { courseId } = req.body;

    if (!currentUserId || !mongoose.isValidObjectId(currentUserId)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let course = null;
    if (mongoose.isValidObjectId(courseId)) {
      course = await Course.findById(courseId).lean();
    } else if (!Number.isNaN(Number(courseId))) {
      course = await Course.findOne({ courseId: Number(courseId) }).lean();
      if (course) courseId = course._id.toString(); // 统一成 _id
    }
    if (!course) return res.status(404).json({ error: "Course not found" });

    const cap = Number(course.capacity || 0);
    const bookedCount = await BookingCourse.countDocuments({
      course: courseId,
      status: "CONFIRMED",
    });

    if (bookedCount >= cap) {
      return res.status(400).json({ error: "Course is full" });
    }

    const booking = await BookingCourse.create({
      userId: currentUserId,   
      course: courseId,       
      status: "CONFIRMED",
    });

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
      .populate("course", "courseName category level")
      .lean();

    const mapped = bookings.map((b) => ({
      ...b,
      course: b.course
        ? { ...b.course, name: b.course.courseName }
        : null,
    }));

    return res.json(mapped);
  } catch (e) {
    console.error("listBookingsByUser error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

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

