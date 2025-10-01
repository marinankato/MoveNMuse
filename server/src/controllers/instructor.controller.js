import Instructor from "../models/instructor.model.js";

// 新建 instructor
export async function createInstructor(req, res) {
  try {
    const { name, email, phone, bio } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email are required" });
    }

    const doc = await Instructor.create({ name, email, phone, bio });
    res.status(201).json({ id: doc._id, message: "Instructor created" });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// 更新 instructor
export async function updateInstructor(req, res) {
  try {
    const { id } = req.params;
    const update = req.body;

    const doc = await Instructor.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: "Instructor not found" });

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// 禁用 instructor
export async function disableInstructor(req, res) {
  try {
    const { id } = req.params;
    const doc = await Instructor.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!doc) return res.status(404).json({ error: "Instructor not found" });

    res.json({ message: "Instructor disabled", instructor: doc });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}

// 列出所有 instructors
export async function listInstructors(req, res) {
  try {
    const docs = await Instructor.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
}


