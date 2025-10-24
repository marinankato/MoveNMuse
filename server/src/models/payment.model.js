// Shirley
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
      type: mongoose.Schema.Types.Decimal128,
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
    paymentDetail: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentDetail",
      required: false,
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
