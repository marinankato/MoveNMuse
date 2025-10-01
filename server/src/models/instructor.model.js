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

// ✅ 默认导出（这样 controller 可以用 import Instructor from ...）
export default Instructor;

// （可选）具名导出，方便有需要时用 import { Instructor } from ...
export { Instructor };

