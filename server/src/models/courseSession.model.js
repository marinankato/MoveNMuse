import mongoose, { Schema } from "mongoose";

const courseSessionSchema = new Schema(
  {
    sessionId: {
      type: Number,
      required: true,
      unique: true,                 // unique session identifier
    },
    courseId: {
      type: Number,
      required: true,
      index: true,                  // search by course
    },
    startTime: {
      type: Date,
      required: true,
      index: true,                  // search by time range / upcoming sessions
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
      index: true,                  // search by instructor
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
      index: true,                  // search by status + time
    },
    price: {
      type: mongoose.Schema.Types.Decimal128,  // more stable approach
      required: true,
      get: (v) => (v ? parseFloat(v.toString()) : v), // return number on get
    },
  },
  {
    timestamps: true,
    collection: "courseSessions",
    versionKey: false,
    toJSON: { getters: true, virtuals: true },  // enable getters/virtuals in res.json
    toObject: { getters: true, virtuals: true },
  }
);

//compound index: improve performance of common queries (without changing fields) 
courseSessionSchema.index({ status: 1, startTime: 1 });     // list upcoming sessions by status
courseSessionSchema.index({ courseId: 1, startTime: 1 });   // recent sessions for a course
courseSessionSchema.index({ instructorId: 1, startTime: 1 });// search by instructor

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

export const CourseSession = mongoose.model("CourseSession", courseSessionSchema);
