import mongoose from "mongoose";
import Course from "../models/course.model.js";
// import BookingCourse from "../models/bookingCourse.model.js";

const ALLOWED_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

/** GET /api/courses */
export const listCourses = async (req, res) => {
  try {
    const kw = (req.query.kw || "").trim();
    const category = (req.query.category || "").trim();
    const level = (req.query.level || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || "10", 10), 1), 50);

    if (kw && (kw.length < 1 || kw.length > 50)) {
      return res.status(400).json({ error: "Keyword length must be between 1 and 50 characters" });
    }
    if (level && level !== "All levels" && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level parameter" });
    }

    const q = {};
    if (category && category.toLowerCase() !== "all categories") q.category = category;
    if (level && level !== "All levels") q.level = level;
    if (kw) {
      const regex = new RegExp(escapeRegex(kw), "i");
      q.$or = [{ courseName: regex }, { description: regex }];
    }

    const cursor = Course.find(q)
      .sort({ createdAt: -1 })
      .select("courseName category level description defaultPrice capacity")
      .lean();

    const [rawItems, total] = await Promise.all([
      cursor.skip((page - 1) * pageSize).limit(pageSize),
      Course.countDocuments(q),
    ]);

    const items = rawItems.map((c) => ({
      id: String(c._id),
      name: c.courseName,
      category: c.category,
      level: c.level || "All levels",
      description: c.description || "",
      price: Number(c.defaultPrice ?? 0),
      capacity: Number(c.capacity ?? 0),
      booked: 0,
      remaining: Number(c.capacity ?? 0),
      lowCapacity: false,
    }));

    return res.json({ items, total, page, pageSize });
  } catch (e) {
    console.error("listCourses error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let course;
    if (mongoose.isValidObjectId(id)) {
      course = await Course.findById(id)
        .select("courseName category level description defaultPrice capacity")
        .lean();
    } else if (!Number.isNaN(Number(id))) {
      course = await Course.findOne({ courseId: Number(id) })
        .select("courseName category level description defaultPrice capacity")
        .lean();
    } else {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    if (!course) return res.status(404).json({ error: "Course not found" });

    const booked = 0;
    const capacity = Number(course.capacity || 0);
    const remaining = Math.max(capacity - booked, 0);

    return res.json({
      id: String(course._id),
      name: course.courseName,
      category: course.category,
      level: course.level || "All levels",
      description: course.description || "",
      price: Number(course.defaultPrice ?? 0),
      capacity,
      booked,
      remaining,
      lowCapacity: remaining <= 3
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
      name, courseName,
      category,
      level,
      price, defaultPrice,
      capacity,
      description,
      courseId
    } = req.body;

    courseName = (courseName ?? name ?? "").trim();
    if (!courseName || courseName.length < 2) {
      return res.status(400).json({ error: "courseName (or name) must be at least 2 characters" });
    }
    if (!category || String(category).trim().length === 0) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (level && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level value" });
    }

    const priceNum = Number(defaultPrice ?? price ?? 0);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return res.status(400).json({ error: "Price must be a number >= 0" });
    }
    const capNum = Number(capacity);
    if (!Number.isInteger(capNum) || capNum < 1) {
      return res.status(400).json({ error: "Capacity must be an integer >= 1" });
    }

    const doc = await Course.create({
      courseId, 
      courseName,
      category,
      level,
      description,
      defaultPrice: priceNum,
      capacity: capNum
    });

    res.status(201).json({ id: doc._id, message: "Course created" });
  } catch (e) {
    console.error("createCourse error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** DELETE /api/courses/:id */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;

    let deleted;
    if (mongoose.isValidObjectId(id)) {
      deleted = await Course.findByIdAndDelete(id);
    } else if (!Number.isNaN(Number(id))) {
      deleted = await Course.findOneAndDelete({ courseId: Number(id) });
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

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}





