import mongoose, { Schema } from "mongoose";

const instructorSchema = new Schema(
  {
    instructorId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
      match: [/^[\d\s+()-]*$/, "Invalid phone number format"],
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "instructors",
  }
);

instructorSchema.index({ name: 1 });
instructorSchema.index({ active: 1, name: 1 });

export const Instructor = mongoose.model("Instructor", instructorSchema);
export default Instructor;


