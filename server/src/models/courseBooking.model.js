// Jiayu
import mongoose from "mongoose";

const bookingCourseSchema = new mongoose.Schema(
  {
    // booking details
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
  },
  // schema options
  { timestamps: true }
);

export default mongoose.model("BookingCourse", bookingCourseSchema);
