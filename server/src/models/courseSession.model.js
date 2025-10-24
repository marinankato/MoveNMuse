// Jiayu
import mongoose, { Schema } from "mongoose";
import { Instructor } from "./instructor.model.js";
import Course from "./course.model.js";
const courseSessionSchema = new Schema(
  {
    sessionId: {
      type: Number,
      required: true,
      unique: true, // unique session identifier
    },
    courseId: {
      type: Number,
      required: true,
      index: true, // search by course
    },
    startTime: {
      type: Date,
      required: true,
      index: true, // search by time range / upcoming sessions
    },
    endTime: {
      type: Date,
      required: true,
      validate: {
        validator(v) {
          return this.startTime ? v > this.startTime : true;
        },
        message: "endTime must be later than startTime",
      },
    },
    duration: {
      type: Number, // minutes
      required: true,
      min: [1, "duration must be >= 1"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [0, "capacity must be >= 0"],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    instructorId: {
      type: Number,
      required: true,
      index: true, // search by instructor
    },
    seatsBooked: {
      type: Number,
      default: 0,
      min: [0, "seatsBooked must be >= 0"],
      validate: {
        validator(v) {
          // seatsBooked must not exceed capacity
          return typeof this.capacity !== "number" ? true : v <= this.capacity;
        },
        message: "seatsBooked must be <= capacity",
      },
    },
    status: {
      type: String,
      required: true,
      enum: ["Scheduled", "Cancelled", "Completed"],
      default: "Scheduled",
      index: true, // search by status + time
    },
    price: {
      type: mongoose.Schema.Types.Decimal128, // more stable approach
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : v), // return number on get
    },
  },
  {
    timestamps: true,
    collection: "courseSessions",
    versionKey: false,
    toJSON: { getters: true, virtuals: true }, // enable getters/virtuals in res.json
    toObject: { getters: true, virtuals: true },
  }
);

//compound index: improve performance of common queries (without changing fields)
courseSessionSchema.index({ status: 1, startTime: 1 }); // list upcoming sessions by status
courseSessionSchema.index({ courseId: 1, startTime: 1 }); // recent sessions for a course
courseSessionSchema.index({ instructorId: 1, startTime: 1 }); // search by instructor

// courseSessionSchema.index({ courseId: 1, startTime: 1 }, { unique: true });

// virtuals
courseSessionSchema.virtual("remaining").get(function () {
  const cap = typeof this.capacity === "number" ? this.capacity : 0;
  const booked = typeof this.seatsBooked === "number" ? this.seatsBooked : 0;
  return Math.max(cap - booked, 0);
});
courseSessionSchema.virtual("lowCapacity").get(function () {
  return this.remaining <= 3; // threshold can be adjusted based on business needs
});

// toJSON transform: ensure price is number
courseSessionSchema.set("toJSON", {
  getters: true,
  virtuals: true,
  transform: (_doc, ret) => {
    if (ret.price && typeof ret.price === "object" && ret.price.toString) {
      ret.price = parseFloat(ret.price.toString());
    }
    return ret;
  },
});

// setter: convert price to Decimal128
courseSessionSchema.path("price").set(function (v) {
  if (v == null) return v;
  if (typeof v === "number")
    return mongoose.Types.Decimal128.fromString(String(v));
  if (typeof v === "string") return mongoose.Types.Decimal128.fromString(v);
  return v; // assume already Decimal128
});

// pre-save hook: auto-assign sessionId
courseSessionSchema.pre("save", async function autoAssignSessionId(next) {
  if (!this.isNew || this.sessionId != null) return next();
  const last = await mongoose
    .model("CourseSession")
    .findOne({}, { sessionId: 1 })
    .sort({ sessionId: -1 })
    .lean();
  this.sessionId = (last?.sessionId ?? 0) + 1;
  next();
});

courseSessionSchema.pre("save", async function (next) {
  try {
    if (typeof this.courseId === "number") {
      const exists = await Course.exists({ courseId: this.courseId });
      if (!exists) return next(new Error("courseId does not exist"));
    }

    if (this.isNew || this.isModified("instructorId")) {
      const inst = await Instructor.findOne({ instructorId: this.instructorId })
        .select("status")
        .lean();
      if (!inst) return next(new Error("instructor not found"));
      if (inst.status !== "active")
        return next(new Error("instructor is inactive"));
    }
    next();
  } catch (err) {
    next(err);
  }
});

// pre-update hook: validate courseId and instructorId on updates
courseSessionSchema.pre("findOneAndUpdate", async function (next) {
  try {
    const u = this.getUpdate() || {};
    const toSet = u.$set ?? u;

    if (toSet.courseId !== undefined) {
      const exists = await Course.exists({ courseId: Number(toSet.courseId) });
      if (!exists) return next(new Error("courseId does not exist"));
    }
    if (toSet.instructorId !== undefined) {
      const newId = Number(toSet.instructorId);
      const inst = await Instructor.findOne({ instructorId: newId })
        .select("status")
        .lean();
      if (!inst) return next(new Error("instructor not found"));
      if (inst.status !== "active")
        return next(new Error("instructor is inactive"));
    }
    next();
  } catch (err) {
    next(err);
  }
});

export const CourseSession = mongoose.model(
  "CourseSession",
  courseSessionSchema
);

// auto-calculate duration before validation
courseSessionSchema.pre("validate", function (next) {
  if (this.startTime && this.endTime) {
    const diff = this.endTime - this.startTime;
    if (Number.isFinite(diff) && diff > 0) {
      this.duration = Math.round(diff / (1000 * 60)); 
    }
  }
  next();
});
