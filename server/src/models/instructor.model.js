// src/models/instructor.model.js
import mongoose from "mongoose";

const instructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    active: { type: Boolean, default: true }, // default true means active
  },
  { timestamps: true }
);

const Instructor = mongoose.model("Instructor", instructorSchema);

export default Instructor;

export { Instructor };

