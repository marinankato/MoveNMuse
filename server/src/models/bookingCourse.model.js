import mongoose from "mongoose";

const bookingCourseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    course: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Course" },
    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true } // ✅ 自动生成 createdAt / updatedAt
);

export default mongoose.model("BookingCourse", bookingCourseSchema);

