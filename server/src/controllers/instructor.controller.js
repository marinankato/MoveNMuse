// Jiayu
import mongoose from "mongoose";
import Instructor from "../models/instructor.model.js";

// create new instructor
export async function createInstructor(req, res) {
  try {
    const { name, email, phone, status } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const doc = await Instructor.create({ name, email, phone, status });
    res.status(201).json({ id: doc._id, message: "Instructor created" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
// update instructor
export async function updateInstructor(req, res) {
  try {
    const query = buildIdQuery(req.params.id);
    const doc = await Instructor.findOneAndUpdate(query, req.body, {
      new: true,
    });
    if (!doc) return res.status(404).json({ error: "Instructor not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// disable instructor
export async function disableInstructor(req, res) {
  try {
    const query = buildIdQuery(req.params.id);
    const doc = await Instructor.findOneAndUpdate(
      query,
      { status: "inactive" },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: "Instructor not found" });
    res.json({ message: "Instructor disabled", instructor: doc });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// list all instructors
export async function listInstructors(req, res) {
  try {
    const docs = await Instructor.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// get instructor by id (supports both _id and instructorId)
export async function getInstructorById(req, res) {
  try {
    const query = buildIdQuery(req.params.id);
    const doc = await Instructor.findOne(query);
    if (!doc) return res.status(404).json({ error: "Instructor not found" });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}
// helper to build query for _id or instructorId
function buildIdQuery(id) {
  if (mongoose.isValidObjectId(id)) return { _id: id };
  const n = Number(id);
  if (!isNaN(n)) return { instructorId: n };
  return { _id: "__never_match__" };
}
