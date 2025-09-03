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
        time: { type: Date, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model("Cart", cartSchema);
