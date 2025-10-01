const mongoose = require("mongoose");

const InstructorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    phone: { type: String, default: "" },
    bio: { type: String, default: "" },
    active: { type: Boolean, default: true }, //default true means the instructor is active
  },
  { timestamps: true }
);

module.exports = mongoose.model("Instructor", InstructorSchema);
