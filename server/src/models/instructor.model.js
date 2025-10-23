import mongoose, { Schema } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const AutoIncrement = AutoIncrementFactory(mongoose.connection);

const instructorSchema = new Schema(
  {
    instructorId: { type: Number, unique: true },  
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^[\d\s+()-]*$/, "Invalid phone number format"],
    },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true, versionKey: false, collection: "instructors" }
);

instructorSchema.plugin(AutoIncrement, {
  inc_field: "instructorId", 
  start_seq: 1,              
});

export const Instructor = mongoose.model("Instructor", instructorSchema);
export default Instructor;
;


