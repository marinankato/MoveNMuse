// Xinyi
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
 },
 {
   timestamps: true,
   collection: "roomSlots",
 }
);


export const RoomSlot = mongoose.model("RoomSlot", roomSlotSchema);
