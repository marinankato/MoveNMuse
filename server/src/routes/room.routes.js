import express from "express";
import { GetAllRooms, GetRoomById } from "../controllers/room.controller.js";

const router = express.Router();

router.get("/", GetAllRooms);

router.get("/:id", GetRoomById);

export default router;