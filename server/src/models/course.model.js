// server/src/models/course.model.js
const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 2, trim: true },
    category: { type: String, required: true, trim: true }, // e.g. Dance / Music
    level: { type: String, default: "All levels", trim: true },
    instructor: { type: String, default: "TBA", trim: true },
    price: { type: Number, default: 0, min: 0 },
    capacity: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    startAt: { type: Date },
    endAt: { type: Date }
  },
  { timestamps: true }
);

// ⚡ 不再保存 remaining，改成 virtual 属性
CourseSchema.virtual("remaining").get(function () {
  // 这里只返回 capacity；真正的剩余名额要在 controller 里结合 Booking 统计
  return this.capacity;
});

// ✅ 让 virtual 在 JSON / Object 转换时可见
CourseSchema.set("toJSON", { virtuals: true });
CourseSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Course", CourseSchema);


