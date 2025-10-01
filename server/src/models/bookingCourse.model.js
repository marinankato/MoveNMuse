import mongoose from "mongoose";

const bookingCourseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "COMPLETED", "CANCELLED"],
      default: "CONFIRMED",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    }
  },
  { timestamps: true }
);

export default mongoose.model("BookingCourse", bookingCourseSchema);
