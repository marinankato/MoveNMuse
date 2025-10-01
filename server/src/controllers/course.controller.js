// server/src/controllers/course.controller.js  (ESM 统一版)
import mongoose from "mongoose";
import Course from "../models/course.model.js";
import BookingCourse from "../models/bookingCourse.model.js";

// 允许的 level（包含显示用的 All levels）
const ALLOWED_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];
// 仅展示 active
const ACTIVE_STATUSES = ["active"];

/** GET /api/courses */
export const listCourses = async (req, res) => {
  try {
    const kw = (req.query.kw || "").trim();
    const category = (req.query.category || "").trim();
    const level = (req.query.level || "").trim();
    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || "0", 10), 0), 50);

    if (kw && (kw.length < 1 || kw.length > 50)) {
      return res.status(400).json({ error: "Keyword length must be between 1 and 50 characters" });
    }
    if (level && level !== "All levels" && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level parameter" });
    }

    const q = { status: { $in: ACTIVE_STATUSES } };
    if (category) q.category = category;
    if (level && level !== "All levels") q.level = level;
    if (kw) {
      const regex = new RegExp(escapeRegex(kw), "i");
      q.$or = [{ name: regex }, { description: regex }];
    }

    const cursor = Course.find(q)
      .sort({ startAt: 1, createdAt: -1 })
      .select("name category level instructor price capacity startAt endAt status description")
      .lean();

    const [items, total] = await Promise.all([
      pageSize > 0 ? cursor.skip((page - 1) * pageSize).limit(pageSize) : cursor,
      Course.countDocuments(q),
    ]);

    // 先不统计预订，保证接口稳定
    const withRemaining = items.map((c) => ({
      ...c,
      booked: 0,
      remaining: Number(c.capacity || 0),
      lowCapacity: false,
    }));

    if (pageSize > 0) return res.json({ items: withRemaining, total, page, pageSize });
    return res.json(withRemaining);
  } catch (e) {
    console.error("listCourses error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** GET /api/courses/:id */
export const getCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const item = await Course.findById(id)
      .select("name category level instructor price capacity startAt endAt status description")
      .lean();

    if (!item || !ACTIVE_STATUSES.includes(item.status)) {
      return res.status(404).json({ error: "Course not found or inactive" });
    }

    // 注意：用 BookingCourse 且状态为 "CONFIRMED"
    const booked = await BookingCourse.countDocuments({ course: item._id, status: "CONFIRMED" });
    const capacity = Number(item.capacity || 0);
    const remaining = Math.max(capacity - booked, 0);

    res.json({ ...item, booked, remaining, lowCapacity: remaining <= 3 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** POST /api/courses (Admin/Staff) */
export const createCourse = async (req, res) => {
  try {
    let {
      name,
      category,
      level,
      instructor,
      price,
      capacity,
      description,
      startAt,
      endAt,
      status,
    } = req.body;

    if (!name || String(name).trim().length < 2) {
      return res.status(400).json({ error: "Name must be at least 2 characters" });
    }
    if (!category || String(category).trim().length === 0) {
      return res.status(400).json({ error: "Category is required" });
    }
    if (level && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level value" });
    }
    if (price != null && (isNaN(price) || Number(price) < 0)) {
      return res.status(400).json({ error: "Price must be a number >= 0" });
    }
    if (capacity == null || !Number.isInteger(Number(capacity)) || Number(capacity) < 1) {
      return res.status(400).json({ error: "Capacity must be an integer >= 1" });
    }

    if (startAt && endAt) {
      const s = new Date(startAt);
      const e = new Date(endAt);
      if (isNaN(s.getTime()) || isNaN(e.getTime())) {
        return res.status(400).json({ error: "startAt/endAt must be valid dates" });
      }
      if (s >= e) return res.status(400).json({ error: "startAt must be earlier than endAt" });
    }

    name = String(name).trim();
    if (!["active", "disabled"].includes(status)) status = "active";

    const doc = await Course.create({
      name,
      category,
      level,
      instructor,
      price: Number(price || 0),
      capacity: Number(capacity),
      description,
      startAt: startAt ? new Date(startAt) : undefined,
      endAt: endAt ? new Date(endAt) : undefined,
      status,
    });

    res.status(201).json({ id: doc._id, message: "Course created" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** DELETE /api/courses/:id (Admin/Staff) */
export const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid course ID" });
    }

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// 工具：转义正则
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}




