import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", 
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
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cart", 
  },
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
