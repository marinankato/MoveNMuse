// Jiayu
import mongoose from "mongoose";
import Course from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";

const ALLOWED_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

/** utils */
function toPrice(x) {
  if (x == null) return 0;
  //  Decimal128 / string / number
  if (typeof x === "object" && typeof x.toString === "function")
    return parseFloat(x.toString());
  if (typeof x === "string") return parseFloat(x) || 0;
  if (typeof x === "number") return x;
  return 0;
}
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** GET /api/courses */
export const listCourses = async (req, res) => {
  try {
    const kw = (req.query.kw || "").trim();
    const category = (req.query.category || "").trim();
    const level = (req.query.level || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const pageSize = Math.min(
      Math.max(parseInt(req.query.pageSize || "10", 10), 1),
      50
    );

    if (kw && kw.length > 50) {
      return res
        .status(400)
        .json({ error: "Keyword length must be ≤ 50 characters" });
    }
    if (level && level !== "All levels" && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level parameter" });
    }

    // basic filters
    const q = {};
    if (category && category.toLowerCase() !== "all categories")
      q.category = category;
    if (level && level !== "All levels") q.level = level;
    if (kw) {
      const regex = new RegExp(escapeRegex(kw), "i");
      q.$or = [{ courseName: regex }, { description: regex }];
    }

    // choose fields to return
    const projection =
      "courseId courseName category level description defaultPrice capacity";

    // fetch paged data
    const [rawItems, total] = await Promise.all([
      Course.find(q)
        // use createdAt desc + courseName asc for consistent ordering
        .sort({ createdAt: -1, courseName: 1 })
        .select(projection)
        .lean()
        .skip((page - 1) * pageSize)
        .limit(pageSize),
      Course.countDocuments(q),
    ]);

    // fetch next upcoming session for each course to get real-time capacity info
    const courseIds = rawItems.map((c) => c.courseId).filter((v) => v != null);
    let nextByCourseId = new Map();

    if (courseIds.length) {
      const now = new Date();
      const rows = await CourseSession.aggregate([
        {
          $match: {
            courseId: { $in: courseIds },
            status: "Scheduled",
            startTime: { $gte: now },
          },
        },
        { $sort: { startTime: 1 } },
        // only keep the earliest (next) session per courseId
        {
          $group: {
            _id: "$courseId",
            sessionId: { $first: "$sessionId" },
            startTime: { $first: "$startTime" },
            capacity: { $first: "$capacity" },
            seatsBooked: { $first: "$seatsBooked" },
          },
        },
      ]);

      nextByCourseId = new Map(rows.map((r) => [r._id, r]));
    }

    const items = rawItems.map((c) => {
      const cap = Number(c.capacity ?? 0);
      // use next session's capacity/booked if available
      const next = nextByCourseId.get(c.courseId);
      const capacity = next?.capacity ?? cap;
      const booked = next?.seatsBooked ?? 0;
      const remaining = Math.max((capacity || 0) - (booked || 0), 0);

      return {
        id: String(c._id),
        courseId: c.courseId ?? null,
        name: c.courseName,
        category: c.category,
        level: c.level || "All levels",
        description: c.description || "",
        price: toPrice(c.defaultPrice),
        capacity,
        booked,
        remaining,
        lowCapacity: remaining <= 3,
        nextStartTime: next?.startTime ?? null,
        nextSessionId: next?.sessionId ?? null,
      };
    });

    return res.json({ items, total, page, pageSize });
  } catch (e) {
    console.error("listCourses error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

//GET /api/courses/:id
export const getCourse = async (req, res) => {
  try {
    const rawId = (req.params.id || "").trim();
    let course;

    if (mongoose.isValidObjectId(rawId)) {
      course = await Course.findById(rawId)
        .select(
          "courseId courseName category level description defaultPrice capacity"
        )
        .lean();
    } else if (!Number.isNaN(Number(rawId))) {
      course = await Course.findOne({ courseId: Number(rawId) })
        .select(
          "courseId courseName category level description defaultPrice capacity"
        )
        .lean();
    } else {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    if (!course) return res.status(404).json({ error: "Course not found" });

    // fetch next 3 upcoming sessions
    const upcoming = await CourseSession.find(
      {
        courseId: course.courseId,
        status: "Scheduled",
        startTime: { $gte: new Date() },
      },
      {
        sessionId: 1,
        startTime: 1,
        endTime: 1,
        duration: 1,
        capacity: 1,
        seatsBooked: 1,
        location: 1,
        price: 1,
        status: 1,
      }
    )
      .sort({ startTime: 1 })
      .limit(3)
      .lean();

    // compute real-time capacity info based on next session
    const head = upcoming?.[0];
    const capacity = head?.capacity ?? Number(course.capacity || 0);
    const booked = head?.seatsBooked ?? 0;
    const remaining = Math.max(capacity - booked, 0);

    return res.json({
      id: String(course._id),
      courseId: course.courseId ?? null,
      name: course.courseName,
      category: course.category,
      level: course.level || "All levels",
      description: course.description || "",
      price: toPrice(course.defaultPrice),
      capacity,
      booked,
      remaining,
      lowCapacity: remaining <= 3,
      upcomingSessions:
        upcoming?.map((s) => ({
          sessionId: s.sessionId,
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.duration,
          capacity: s.capacity,
          seatsBooked: s.seatsBooked,
          location: s.location,
          price: toPrice(s.price),
          status: s.status || "Scheduled",
        })) ?? [],
    });
  } catch (e) {
    console.error("getCourse error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** POST /api/courses */
export const createCourse = async (req, res) => {
  try {
    let {
      name,
      courseName,
      category,
      level,
      defaultPrice,
      description,
      courseId,
    } = req.body;

    // validate inputs
    courseName = (courseName ?? name ?? "").trim();
    if (!courseName || courseName.length < 2) {
      return res
        .status(400)
        .json({ error: "courseName (or name) must be at least 2 characters" });
    }
    if (!category || String(category).trim().length === 0) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (level && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level value" });
    }

    const priceNum = toPrice(defaultPrice ?? 0);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "Price must be a number >= 0" });
    }
    // create with retry on duplicate key (e.g. courseId)
    let assignedId = courseId ?? null;
    const MAX_RETRY = 3;

    for (let attempt = 0; attempt <= MAX_RETRY; attempt++) {
      try {
        if (assignedId == null) {
          // auto-assign courseId as max+1
          const last = await Course.findOne({}, { courseId: 1 })
            .sort({ courseId: -1 })
            .lean();

          assignedId = (last?.courseId ?? 0) + 1;
        }

        const doc = await Course.create({
          courseId: assignedId,
          courseName,
          category,
          level,
          description,
          defaultPrice: priceNum, // use setter
        });

        return res.status(201).json({
          id: String(doc._id),
          courseId: doc.courseId,
          message: "Course created",
        });
      } catch (e) {
        // duplicate key on courseId, retry with +1
        if (e?.code === 11000 && e?.keyPattern?.courseId) {
          assignedId = Number(assignedId) + 1;
          if (attempt === MAX_RETRY) {
            return res
              .status(409)
              .json({ error: "Duplicate key after retries", key: e.keyValue });
          }
          continue; // try again
        }
        // other error, abort
        throw e;
      }
    }
  } catch (e) {
    console.error("createCourse error:", e);
    return res.status(500).json({ error: e.message || "Server error" });
  }
};

//DELETE /api/courses/:id
export const deleteCourse = async (req, res) => {
  try {
    const rawId = (req.params.id || "").trim();

    let deleted;
    if (mongoose.isValidObjectId(rawId)) {
      deleted = await Course.findByIdAndDelete(rawId);
    } else if (!Number.isNaN(Number(rawId))) {
      deleted = await Course.findOneAndDelete({ courseId: Number(rawId) });
    } else {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    if (!deleted) return res.status(404).json({ error: "Course not found" });

    res.json({ message: "Course deleted successfully" });
  } catch (e) {
    console.error("deleteCourse error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

//GET /api/courses/open
export const listOpenCourses = async (req, res) => {
  try {
    const now = new Date();

    const rows = await CourseSession.aggregate([
      { $match: { status: "Scheduled", endTime: { $gt: now } } },

      {
        $lookup: {
          from: "instructors",
          localField: "instructorId",
          foreignField: "instructorId",
          as: "inst",
        },
      },
      { $unwind: { path: "$inst", preserveNullAndEmptyArrays: false } },
      { $match: { "inst.status": "active" } },

      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "courseId",
          as: "course",
        },
      },
      { $unwind: "$course" },

      {
        $group: {
          _id: "$courseId",
          course: { $first: "$course" },
          nextSession: { $min: "$startTime" },
        },
      },
      { $sort: { nextSession: 1 } },

      {
        $project: {
          _id: 0,
          courseId: "$_id",
          name: "$course.courseName",
          category: "$course.category",
          level: "$course.level",
          description: "$course.description",
          price: "$course.defaultPrice",
          nextSession: 1,
        },
      },
    ]);

    res.json({ items: rows });
  } catch (err) {
    console.error("listOpenCourses error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// PUT /api/courses/:id
export async function updateCourse(req, res) {
  try {
    const id = Number(req.params.id);
    const updates = req.body;

    const course = await Course.findOne({ courseId: id });
    if (!course) return res.status(404).json({ error: "Course not found" });

    if (updates.name) course.courseName = updates.name;
    if (updates.courseName) course.courseName = updates.courseName;
    if (updates.description) course.description = updates.description;
    if (updates.defaultPrice != null)
      course.defaultPrice = toPrice(updates.defaultPrice);
    if (updates.category) course.category = updates.category;
    if (updates.level) course.level = updates.level;

    await course.save();
    res.json({ message: "Course updated successfully", course });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
