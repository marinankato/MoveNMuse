import express from "express";
import User from "../models/user.model.js"; 
import authMiddleware from "../middlewares/auth.middleware.js";
import { UserViewProfileController } from "../controllers/user.controller.js";
import { UserUpdateProfileController } from "../controllers/user.controller.js";
import { registerUser } from "../controllers/registerUser.controller.js";

const router = express.Router();
router.get("/profile", authMiddleware, UserViewProfileController);
router.put("/update", authMiddleware, UserUpdateProfileController);
router.post('/register', registerUser); 

export default router;
