import mongoose, { Schema } from "mongoose";

const courseSessionSchema = new Schema(
  {
    sessionId: {
      type: Number,
      required: true,
      unique: true,
    },
    courseId: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    instructorId: {
      type: Number,
      required: true,
    },
    seatsBooked: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "courseSessions", 
  }
);

export const CourseSession = mongoose.model("CourseSession", courseSessionSchema);