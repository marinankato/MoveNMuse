// Marina
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import { 
  UserViewProfileController, 
  UserUpdateProfileController 
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", authMiddleware, UserViewProfileController);
router.put("/", authMiddleware, UserUpdateProfileController);

export default router;
