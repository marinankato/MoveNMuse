import mongoose from "mongoose";
import { CourseSession } from "../models/courseSession.model.js";

// GET /api/course-sessions
// ?courseId=2&instructorId=1001&status=Scheduled&from=2025-10-14&to=2025-10-21&page=1&limit=10
export const listCourseSessions = async (req, res) => {
  try {
    let { courseId, instructorId, status, from, to, page = 1, limit = 10 } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const q = {};
    if (!Number.isNaN(Number(courseId))) q.courseId = Number(courseId);
    if (!Number.isNaN(Number(instructorId))) q.instructorId = Number(instructorId);
    if (status) q.status = status;
    if (from || to) {
      q.startTime = {};
      if (from) q.startTime.$gte = new Date(from);
      if (to) q.startTime.$lte = new Date(to);
    }

    const [items, total] = await Promise.all([
      CourseSession.find(q).sort({ startTime: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      CourseSession.countDocuments(q),
    ]);

    res.json({ total, page, pageSize: limit, items });
  } catch (e) {
    console.error("listCourseSessions error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// GET /api/course-sessions/:id  (support both ObjectId and numeric sessionId)
export const getCourseSession = async (req, res) => {
  try {
    const { id } = req.params;
    let doc = null;
    if (mongoose.isValidObjectId(id)) {
      doc = await CourseSession.findById(id).lean();
    } else if (!Number.isNaN(Number(id))) {
      doc = await CourseSession.findOne({ sessionId: Number(id) }).lean();
    }
    if (!doc) return res.status(404).json({ error: "CourseSession not found" });
    res.json(doc);
  } catch (e) {
    console.error("getCourseSession error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// POST /api/course-sessions
// POST /api/course-sessions
export const createCourseSession = async (req, res) => {
  try {
    let {
      courseId, startTime, endTime,
      capacity, location, instructorId, price,
      status = "Scheduled",
    } = req.body;

    // 1) 基本校验与类型转换
    courseId = Number(courseId);
    instructorId = Number(instructorId);
    capacity = Number(capacity);
    if (Number.isNaN(courseId) || Number.isNaN(instructorId) || Number.isNaN(capacity)) {
      return res.status(400).json({ error: "courseId/capacity/instructorId must be numbers" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    if (!(start instanceof Date && !isNaN(start)) || !(end instanceof Date && !isNaN(end))) {
      return res.status(400).json({ error: "startTime/endTime must be valid datetimes" });
    }
    if (end <= start) {
      return res.status(400).json({ error: "endTime must be later than startTime" });
    }

    // 2) 由后端计算 duration（分钟）
    const duration = Math.round((end.getTime() - start.getTime()) / 60000);

    // 3) 可选字段：价格
    const payload = {
      courseId,
      instructorId,
      startTime: start,
      endTime: end,
      duration,
      capacity,
      location,
      status,
    };
    if (price !== undefined && price !== null && `${price}`.trim() !== "") {
      const p = Number(price);
      if (Number.isNaN(p)) return res.status(400).json({ error: "price must be a number" });
      payload.price = p;
    }

    // 4) 创建（sessionId 如需自增/钩子生成，不要从前端接收）
    const last = await CourseSession
    .findOne({}, { sessionId: 1 })
    .sort({ sessionId: -1 })
    .lean();

    const nextSessionId = (last?.sessionId || 9000) + 1; // 起始可自定
    payload.sessionId = nextSessionId;
    const doc = await CourseSession.create(payload);
    return res
      .status(201)
      .json({ id: String(doc._id), sessionId: doc.sessionId, message: "Session created" });
  } catch (e) {
    if (e?.code === 11000) return res.status(409).json({ error: "Duplicate key", key: e.keyValue });
    console.error("createCourseSession error:", e);
    return res.status(400).json({ error: e.message || "Bad request" });
  }
};


// PATCH /api/course-sessions/:id   
export const updateCourseSession = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };
    // prevent seatsBooked from exceeding capacity
    if (typeof payload.seatsBooked === "number") {
      const cur = await CourseSession.findOne(mongoose.isValidObjectId(id) ? { _id: id } : { sessionId: Number(id) })
        .select("capacity").lean();
      if (!cur) return res.status(404).json({ error: "CourseSession not found" });
      if (payload.seatsBooked < 0 || payload.seatsBooked > cur.capacity)
        return res.status(400).json({ error: "seatsBooked out of range" });
    }

    const doc = await CourseSession.findOneAndUpdate(
      mongoose.isValidObjectId(id) ? { _id: id } : { sessionId: Number(id) },
      { $set: payload },
      { new: true }
    ).lean();

    if (!doc) return res.status(404).json({ error: "CourseSession not found" });
    res.json({ message: "Session updated", item: doc });
  } catch (e) {
    console.error("updateCourseSession error:", e);
    res.status(400).json({ error: e.message || "Bad request" });
  }
};

// DELETE /api/course-sessions/:id
export const deleteCourseSession = async (req, res) => {
  try {
    const { id } = req.params;
    const ret = await CourseSession.deleteOne(mongoose.isValidObjectId(id) ? { _id: id } : { sessionId: Number(id) });
    if (ret.deletedCount === 0) return res.status(404).json({ error: "CourseSession not found" });
    res.json({ message: "Session deleted" });
  } catch (e) {
    console.error("deleteCourseSession error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// POST /api/course-sessions/:id/book  
export const bookSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const match = mongoose.isValidObjectId(id) ? { _id: id } : { sessionId: Number(id) };

    const updated = await CourseSession.findOneAndUpdate(
      { ...match, status: "Scheduled", $expr: { $lt: ["$seatsBooked", "$capacity"] } },
      { $inc: { seatsBooked: 1 } },
      { new: true }
    ).lean();

    if (!updated) return res.status(409).json({ error: "Session full or not schedulable" });
    res.json({ message: "Seat booked", item: updated });
  } catch (e) {
    console.error("bookSeat error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// POST /api/course-sessions/:id/cancel  (release a seat, avoid negative)
export const cancelSeat = async (req, res) => {
  try {
    const { id } = req.params;
    const match = mongoose.isValidObjectId(id) ? { _id: id } : { sessionId: Number(id) };

    const updated = await CourseSession.findOneAndUpdate(
      { ...match, status: "Scheduled", seatsBooked: { $gt: 0 } },
      { $inc: { seatsBooked: -1 } },
      { new: true }
    ).lean();

    if (!updated) return res.status(409).json({ error: "No seats to release or status not schedulable" });
    res.json({ message: "Seat released", item: updated });
  } catch (e) {
    console.error("cancelSeat error:", e);
    res.status(500).json({ error: e.message || "Server error" });
  }
};
