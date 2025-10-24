import mongoose, { Schema } from "mongoose";

const ALLOWED_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced"];

const courseSchema = new Schema(
  {
    // course metadata
    courseId: { type: Number, required: true, unique: true, index: true },
    courseName: { type: String, required: true, minlength: 2, trim: true },
    category: { type: String, required: true, trim: true, index: true },
    level: {
      type: String,
      trim: true,
      enum: ALLOWED_LEVELS,
      default: "All levels",
      index: true,
    },
    description: { type: String, trim: true },
    defaultPrice: {
      type: mongoose.Schema.Types.Decimal128, // change to Decimal128
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : v), // return number on get
      set: (v) =>
        v == null ? v : mongoose.Types.Decimal128.fromString(String(v)),
    },
  },
  {
    // schema options
    timestamps: true,
    versionKey: false,
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true },
  }
);

// text index for search
courseSchema.index({ courseName: "text", description: "text" });

export default mongoose.model("Course", courseSchema);
