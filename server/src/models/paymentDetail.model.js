import mongoose, { Schema } from "mongoose";

const paymentDetailSchema = new Schema(
  {
    paymentDetailId: {
      type: Number,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
      index: true, // allow multiple cards per user
    },
    cardBrand: {
      type: String,
      required: true,
      enum: ["Visa", "Mastercard"], // restrict values
    },
    nickname: {
      type: String,
      maxlength: 100,
    },
    name: {
      type: String,
      required: true,
      maxlength: 100,
    },
    cardNumber: {
      type: String,
      required: true,
      minlength: 13,
      maxlength: 19,
    },
    cardSecurityCode: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 3,
    },
    expiryMonth: {
      type: Number,
      required: true,
      min: 1,
      max: 12,
    },
    expiryYear: {
      type: Number,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const PaymentDetail = mongoose.model(
  "PaymentDetail",
  paymentDetailSchema
);
