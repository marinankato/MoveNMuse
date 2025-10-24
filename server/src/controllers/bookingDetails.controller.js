// Marina
import Booking from "../models/booking.model.js";
import { CourseSession } from "../models/courseSession.model.js";
import Course from "../models/course.model.js";
import mongoose from "mongoose";

export const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({ message: "Invalid booking ID format" });
    }

    const booking = await Booking.findById(bookingId).lean();
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Extract all occurrenceIds from booking items
    const occurrenceIds = booking.items.map((item) => item.occurrenceId);

    // Fetch all course sessions in one query
    const sessions = await CourseSession.find({ sessionId: { $in: occurrenceIds } }).lean({ getters: true });

    // Fetch all related courses
    const courseIds = [...new Set(sessions.map((s) => s.courseId))];
    const courses = await Course.find({ courseId: { $in: courseIds } })
      .select("courseId courseName level category")
      .lean();
    const coursesMap = Object.fromEntries(courses.map((c) => [c.courseId, c]));

    // Map session info into booking items
    const itemsWithSession = booking.items.map((item) => {
      const session = sessions.find((s) => s.sessionId === item.occurrenceId);
      return {
        ...item,
        session: session
          ? {
              ...session,
              courseName: coursesMap[session.courseId]?.courseName,
              level: coursesMap[session.courseId]?.level,
              category: coursesMap[session.courseId]?.category,
            }
          : null,
      };
    });

    res.json({ ...booking, items: itemsWithSession });
  } catch (err) {
    console.error("Error fetching booking details:", err);
    res.status(500).json({ message: "Server error" });
  }
};
