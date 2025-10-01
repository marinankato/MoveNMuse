import express from "express";
import { roomController } from "../controllers/room.controller.js";

const router = Router();

router.get("/", roomController.list);
router.get("/seeed", roomController.seed);
router.get("/:id", roomController.get);
router.post("/", roomController.create);
router.put("/:id", roomController.update);
router.delete("/:id", roomController.remove);

export default router;