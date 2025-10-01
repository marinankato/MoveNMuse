import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    courseId: { type: Number, required: true, unique: true },
    name: { type: String, required: true, minlength: 2, trim: true },
    category: { type: String, required: true, trim: true },
    level: {
      type: String,
      default: "All levels",
      enum: ["All levels", "Beginner", "Intermediate", "Advanced"],
      trim: true,
    },
    instructor: { type: String, default: "TBA", trim: true },
    price: { type: Number, default: 0, min: 0 },
    defaultPrice: { type: Number, required: true }, // ✅ 简化
    capacity: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "", trim: true },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    startAt: { type: Date },
    endAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);

