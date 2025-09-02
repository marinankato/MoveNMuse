import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    cartID: {
      type: String,
      required: true,
      unique: true,
    },
    userID: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        itemID: { type: String, required: true },
        startTime: { type: Date, required: true },
        price: { type: Number, required: true },
        selected: { type: Boolean, default: false },
        selectedTotal: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
