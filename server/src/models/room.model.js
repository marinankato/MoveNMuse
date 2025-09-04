import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
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
        required: true,
        min: 1,
      },
      pricePerHour: {
        type: Number,
        required: true,
        min: 0,
      },
      amenities: [
        {
          type: String,
          trim: true,
        },
      ],
      rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      isAvailable: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );
  
  const Room = mongoose.model("Room", roomSchema);
  export default Room;