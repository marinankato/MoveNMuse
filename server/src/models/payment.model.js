import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    paymentId: {
      type: Number,
      required: true,
      unique: true,
    },
    orderId: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending","Successful", "Failed", "Refunded"],
      default: "Pending",
    },
    userId: {
      type: Number,
      required: true,

    },
    paymentDetailId: {
      type: Number,
      required: true,
    },
    paymentDate: {
      type: Date,
            required: true,
      
    },

  },
  {
    timestamps: true,
    collection: "payments",
  }
);

export const Payment = mongoose.model(
  "Payment",
  paymentSchema
);
