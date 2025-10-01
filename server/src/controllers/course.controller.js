// server/src/controllers/course.controller.js
const mongoose = require("mongoose");
const Course = require("../models/course.model");
const Booking = require("../models/booking.model");

// 允许的 level（含显示用的 All levels）
const ALLOWED_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];
// 仅展示 active 课程
const ACTIVE_STATUSES = ["active"];

/** GET /api/courses
 * 支持：
 *  - ?kw=keyword
 *  - ?category=Dance
 *  - ?level=Beginner | Intermediate | Advanced（空串或 All levels 表示不过滤）
 *  - ?page=1&pageSize=10  （pageSize=0 表示不分页）
 */
exports.listCourses = async (req, res) => {
  try {
    const kw = (req.query.kw || "").trim();
    const category = (req.query.category || "").trim();
    const level = (req.query.level || "").trim(); // 可能是 "" / "All levels" / 具体级别

    const page = Math.max(parseInt(req.query.page || "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || "0", 10), 0), 50);

    // 校验
    if (kw && (kw.length < 1 || kw.length > 50)) {
      return res.status(400).json({ error: "Keyword length must be between 1 and 50 characters" });
    }
    if (level && level !== "All levels" && !ALLOWED_LEVELS.includes(level)) {
      return res.status(400).json({ error: "Invalid level parameter" });
    }

    // 查询条件：只展示 active
    const q = { status: { $in: ACTIVE_STATUSES } };
    if (category) q.category = category;
    // 只有在 level 是具体级别（非空、非 All levels）时才加条件
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

    // 统计每门课的已预约数量（仅统计 Confirmed）
    const ids = items.map((c) => c._id);
    const agg = await Booking.aggregate([
      { $match: { course: { $in: ids }, status: "Confirmed" } },
      { $group: { _id: "$course", cnt: { $sum: 1 } } },
    ]);
    const bookedMap = new Map(agg.map((a) => [String(a._id), a.cnt]));

    const withRemaining = items.map((c) => {
      const booked = bookedMap.get(String(c._id)) || 0;
      const capacity = Number(c.capacity || 0);
      const remaining = Math.max(capacity - booked, 0);
      return {
        ...c,
        booked,
        remaining,
        lowCapacity: remaining <= 3,
      };
    });

    if (pageSize > 0) {
      return res.json({ items: withRemaining, total, page, pageSize });
    }
    return res.json(withRemaining);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** GET /api/courses/:id */
exports.getCourse = async (req, res) => {
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

    const booked = await Booking.countDocuments({ course: item._id, status: "Confirmed" });
    const capacity = Number(item.capacity || 0);
    const remaining = Math.max(capacity - booked, 0);

    res.json({ ...item, booked, remaining, lowCapacity: remaining <= 3 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

/** POST /api/courses  (Admin/Staff) */
exports.createCourse = async (req, res) => {
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
exports.deleteCourse = async (req, res) => {
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

/** 可选：初始化样例课程 */
// exports.seedIfEmpty = async () => {
//   const count = await Course.countDocuments();
//   if (count > 0) return;

//   await Course.insertMany([
//     {
//       name: "Hip Hop Basics",
//       category: "Dance",
//       level: "Beginner",
//       instructor: "Alice",
//       price: 25,
//       capacity: 20,
//       description: "Learn basic hip hop moves in a fun group class.",
//       status: "active",
//       startAt: new Date(Date.now() + 2 * 86400000),
//       endAt: new Date(Date.now() + 2 * 86400000 + 60 * 60 * 1000),
//     },
//     {
//       name: "Piano for Beginners",
//       category: "Music",
//       level: "Beginner",
//       instructor: "Bob",
//       price: 30,
//       capacity: 10,
//       description: "A gentle introduction to piano for all ages.",
//       status: "active",
//       startAt: new Date(Date.now() + 3 * 86400000),
//       endAt: new Date(Date.now() + 3 * 86400000 + 60 * 60 * 1000),
//     },
//   ]);
// };

// 工具：转义正则
function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}



