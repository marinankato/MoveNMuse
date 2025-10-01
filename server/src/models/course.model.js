import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    courseId: { type: Number, required: true, unique: true },
    courseName: { type: String, required: true, minlength: 2, trim: true },
    category: { type: String, required: true, trim: true },
    level: { type: String, trim: true },
    description: { type: String, trim: true },
    defaultPrice: { type: Number, required: true },
    capacity: { type: Number, default: 0, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);

