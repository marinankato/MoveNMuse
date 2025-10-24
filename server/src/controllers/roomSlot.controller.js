// Xinyi
import { RoomSlot } from "../models/roomSlot.model.js";
import Room from "../models/room.model.js"; 

 const toPlainNumber = (val) => {
    if (val == null) return 0;

    if (typeof val === "object" && val?._bsontype === "Decimal128") {
        return parseFloat(val.toString());
    }

    if (typeof val === "object" && val?.$numberDecimal) {
        return parseFloat(val.$numberDecimal);
    }

    const n = Number(val);
    return Number.isFinite(n) ? n : 0;
 };
 
export const listRoomSlots = async (req, res, next) => {
   try {
       const { roomId } = req.params;
       const { from, to } = req.query;

       const fromDate = new Date(from);
       const toDate = new Date(to);

        const filter = { roomId: Number(roomId) };
       if (from && to) {
        filter.$and = [
            { startTime: { $lt: new Date(to) } },
            { endTime: { $gt: new Date(from) } },
        ];
       }

       const slots = await RoomSlot.find(filter).sort({ startTime: 1 }).lean();
       const normalized = slots.map(s => ({
        ...s,
        price: s.price != null ? Number(s.price) : 0
       }))
       res.json(normalized);
   } catch (err) {
       next(err);
   }
};

export const createRoomSlot = async (req, res, next) => {
    try {
        const slot = await RoomSlot.create(req.body);
        res.status(201).json(slot);
    } catch (err) {
        next (err);
    }
};

export const getRoomSlotById = async (req, res) => {
  try {
    const { roomSlotId } = req.params;

    // Find the slot first
    const slot = await RoomSlot.findOne({ roomSlotId: Number(roomSlotId) });
    if (!slot) return res.status(404).json({ error: "Room slot not found" });

    // Fetch the corresponding room using numeric roomId
    const room = await Room.findOne({ roomId: slot.roomId });
    if (!room) return res.status(404).json({ error: "Room not found" });

    res.json({ slot, room });
  } catch (err) {
    console.error("getRoomSlotById error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};