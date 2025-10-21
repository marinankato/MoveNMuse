import express from "express";
import { listRoomSlots, createRoomSlot } from "../controllers/roomSlot.controller.js";


const router = express.Router();


router.get("/:roomId", listRoomSlots);
router.post("/", createRoomSlot);


export default router;
