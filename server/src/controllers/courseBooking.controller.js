// Jiayu
import mongoose from "mongoose";
import BookingCourse from "../models/courseBooking.model.js";
import Course from "../models/course.model.js";

/** POST /api/bookings  body: { courseId } */
export const createBooking = async (req, res) => {
  const currentUserId = req.user?.fid || req.user?._id;
  let { courseId } = req.body;

  if (!currentUserId || !mongoose.isValidObjectId(currentUserId)) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  if (!courseId) {
    return res.status(400).json({ error: "courseId is required" });
  }

  try {
    // analyze courseId which can be ObjectId or numeric courseId
    let courseDoc = null;
    if (mongoose.isValidObjectId(courseId)) {
      courseDoc = await Course.findById(courseId).lean();
    } else if (!Number.isNaN(Number(courseId))) {
      courseDoc = await Course.findOne({ courseId: Number(courseId) }).lean();
      if (courseDoc) courseId = courseDoc._id.toString();
    } else {
      return res.status(400).json({ error: "Invalid courseId" });
    }

    if (!courseDoc) return res.status(404).json({ error: "Course not found" });

    const cap = Number(courseDoc.capacity || 0);
    if (cap <= 0) {
      return res.status(400).json({ error: "Course capacity is 0" });
    }

    // power, check for existing booking (idempotent)
    const existing = await BookingCourse.findOne({
      userId: currentUserId,
      course: courseId,
      status: { $in: ["CONFIRMED", "PENDING"] },
    }).lean();

    if (existing) {
      return res.status(200).json({
        id: existing._id,
        message: "Already booked",
        duplicated: true,
      });
    }

    // erupt simultaneous bookings with transaction
    const session = await mongoose.startSession();
    let created;
    await session.withTransaction(async () => {
      const bookedCount = await BookingCourse.countDocuments({
        course: courseId,
        status: "CONFIRMED",
      }).session(session);

      if (bookedCount >= cap) {
        throw new Error("Course is full");
      }

      created = await BookingCourse.create(
        [
          {
            userId: currentUserId,
            course: courseId,
            status: "CONFIRMED",
          },
        ],
        { session }
      ).then((r) => r[0]);
    });
    session.endSession();

    return res
      .status(201)
      .json({ id: created._id, message: "Booking confirmed" });
  } catch (e) {
    // objectisation
    if (e?.message === "Course is full") {
      return res.status(400).json({ error: e.message });
    }
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
      .populate({
        path: "course",
        select: "courseName category level courseId",
      })
      .select("_id status createdAt updatedAt course") // only these fields
      .lean();

    const items = bookings.map((b) => ({
      id: b._id,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      course: b.course
        ? {
            id: b.course._id,
            courseId: b.course.courseId ?? null,
            name: b.course.courseName,
            category: b.course.category,
            level: b.course.level || "All levels",
          }
        : null,
    }));

    return res.json(items);
  } catch (e) {
    console.error("listBookingsByUser error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

/** PATCH /api/bookings/:id/cancel  or  DELETE /api/bookings/:id */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid booking id" });
    }

    const booking = await BookingCourse.findById(id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.status === "CANCELLED") {
      return res.status(200).json({ message: "Already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    return res.json({ message: "Booking cancelled", id: booking._id });
  } catch (e) {
    console.error("cancelBooking error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

/** GET /api/bookings/capacity-board?from=yyyy-mm-dd&to=yyyy-mm-dd&low=n */
export const capacityBoard = async (req, res) => {
  try {
    const { from, to, low } = req.query;
    const lowNum = Number(low ?? 3);

    const start = from ? new Date(from) : null;
    const end = to ? new Date(to) : null;

    const filter = {};
    if (start || end) {
      filter.createdAt = {};
      if (start) filter.createdAt.$gte = start;
      if (end) filter.createdAt.$lte = end;
    }

    const courses = await Course.find().select("courseName capacity").lean();

    const bookings = await BookingCourse.aggregate([
      {
        $match: {
          ...(filter.createdAt ? { createdAt: filter.createdAt } : {}),
        },
      },
      {
        $group: {
          _id: "$course",
          booked: { $sum: 1 },
        },
      },
    ]);

    // map for quick lookup
    const bookingMap = new Map(bookings.map((b) => [String(b._id), b.booked]));
    const items = courses.map((c) => {
      const booked = bookingMap.get(String(c._id)) ?? 0;
      const remaining = Math.max(Number(c.capacity || 0) - booked, 0);
      return {
        id: c._id,
        name: c.courseName,
        capacity: Number(c.capacity || 0),
        booked,
        remaining,
        lowCapacity: remaining <= lowNum,
      };
    });

    return res.json({ total: items.length, lowThreshold: lowNum, items });
  } catch (e) {
    console.error("capacityBoard error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};
