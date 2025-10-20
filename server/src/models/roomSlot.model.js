import mongoose, { Schema } from "mongoose";

//to do: update schema according to room slot structure
const roomSlotSchema = new Schema(
  {
    roomSlotId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Number,
      required: true,
      unique: true,
    },
    roomSlotItems: [
      {
        itemId: { type: Number, required: true },
        productId: { type: Number, required: true },
        productType: { type: String, required: true },
        occurenceId: { type: Number, required: true },
        title: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  {
    timestamps: true,
    collection: "roomSlots", 

  }
);

export default mongoose.model("RoomSlot", roomSlotSchema);
