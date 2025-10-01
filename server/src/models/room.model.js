import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      type: {
        type: String,
        enum: ["Dance", "Music"],
        required: true,
      },
      capacity: {
        type: Number,
        default: 1,
        min: 1,
      },
      pricePerHour: {
        type: Number,
        default: 0,
        min: 0,
      },
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      images: {
        type: [String],
        default: [],
      },
      amenities: {
          type: [String],
          default: [] 
        },
    },
        { timestamps: true }
);
     
  const Room = mongoose.model("Room", RoomSchema);
  export default Room;