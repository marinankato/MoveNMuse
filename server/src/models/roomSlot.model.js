import mongoose, { Schema } from "mongoose";


//to do: update schema according to room slot structure
const roomSlotSchema = new Schema(
 {
   roomId: {
     type: Number,
     required: true,
   },
   roomSlotId: {
    type: Number,
    unique: true,
   },
   startTime: {
     type: Date,
     required: true,
   },
   endTime: {
     type: Date,
     required: true,
   },
   duration: {
    type: Number,
    default: 60
   },
   price: { 
    type: Schema.Types.Decimal128, 
    default: 0 
  },
   isAvailable: {
     type: Boolean,
     default: true,
   },
  //  roomSlotId: {
  //    type: String,
  //    required: true,
  //    unique: true,
  //  },
  //  userId: {
  //    type: Number,
  //    required: true,
  //  },
  //  roomSlotItems: [
  //    {
  //      itemId: { type: Number, required: true },
  //      productId: { type: Number, required: true },
  //      productType: { type: String, required: true },
  //      occurenceId: { type: Number, required: true },
  //      title: { type: String, required: true },
  //      price: { type: Number, required: true },
  //    },
  //  ],
 },
 {
   timestamps: true,
   collection: "roomSlots",
 }
);


export const RoomSlot = mongoose.model("RoomSlot", roomSlotSchema);
