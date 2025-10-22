import { Router } from "express";
import { roomController } from "../controllers/room.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", roomController.list);
router.get("/:id", roomController.get);
router.post("/", authMiddleware, roomController.create);
router.put("/:id", authMiddleware, roomController.update);
router.delete("/:id", authMiddleware, roomController.remove);

export default router;