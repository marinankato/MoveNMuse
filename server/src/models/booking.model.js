import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
    ref: "user",
  },
  orderId: {
    type: Number,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["Confirmed", "Completed", "Cancelled"],
    default: "Confirmed",
  },
  orderTotal: {
    type: Number,
  },
  items: [
    {
      itemId: { type: Number },
      productId: { type: Number },
      productType: { type: String },
      occurrenceId: { type: Number },
    },

  ],
},
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
