import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema(
  {
    cartID: {
      type: String,
      required: true,
      unique: true,
    },
    userEmail: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        itemID: { type: Number, required: true },
        date: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Cart = mongoose.model("Cart", cartSchema);
