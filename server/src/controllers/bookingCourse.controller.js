import mongoose from "mongoose";
import BookingCourse from "../models/bookingCourse.model.js";
import Course from "../models/course.model.js";

// 创建预订
export const createBooking = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(courseId)) {
      return res.status(400).json({ error: "Invalid userId or courseId" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ error: "Course not found" });

    // 统计已预订人数
    const bookedCount = await BookingCourse.countDocuments({
      course: courseId,
      status: "CONFIRMED",
    });

    if (bookedCount >= course.capacity) {
      return res.status(400).json({ error: "Course is full" });
    }

    const booking = await BookingCourse.create({ userId, course: courseId });
    res.status(201).json({ id: booking._id, message: "Booking confirmed" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 查看某用户的预订
export const listBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid userId" });
    }

    const bookings = await BookingCourse.find({ userId })
      .populate("course", "name category startAt endAt instructor")
      .lean();

    res.json(bookings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// 取消预订
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
    res.json({ message: "Booking cancelled", booking });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
