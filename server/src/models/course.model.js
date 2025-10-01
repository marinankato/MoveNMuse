import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    courseId: {
      type: Number,
      required: true,
      unique: true,
    },
    courseName: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    description: {
      type: String,
      required: true,
    },
    defaultPrice: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);