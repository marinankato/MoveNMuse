const Instructor = require("../models/instructor.model");

// 新增讲师
exports.createInstructor = async (req, res) => {
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
};

// 修改讲师
exports.updateInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;

    const doc = await Instructor.findByIdAndUpdate(id, update, { new: true });
    if (!doc) return res.status(404).json({ error: "Instructor not found" });

    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// 停用讲师（active=false）
exports.disableInstructor = async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await Instructor.findByIdAndUpdate(id, { active: false }, { new: true });
    if (!doc) return res.status(404).json({ error: "Instructor not found" });

    res.json({ message: "Instructor disabled", instructor: doc });
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
};

// 查看讲师列表
exports.listInstructors = async (req, res) => {
  try {
    const docs = await Instructor.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message || "Server error" });
  }
};

