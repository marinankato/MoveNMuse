import { RoomSlot } from "../models/roomSlot.model.js";


export const listRoomSlots = async (req, res, next) => {
   try {
       const { roomId } = req.params;
       const { from, to } = req.query;

       const filter = { 
        roomId: Number(roomId) 
    };

       if (from && to) {
        filter.$and = [
            { startTime: { $lt: new Date(to) } },
            { endTime: { $gt: new Date(from) } },
        ];
       }

       const slots = await RoomSlot.find(filter).sort({ startTime: 1 }).lean();
       res.json(slots);
   } catch (err) {
       next(err);
   }
};


