// Marina
import express from "express";
// import { verifyToken } from "../middlewares/auth.middleware.js";
import { loginUser } from "../controllers/auth.controller.js"; // Import the loginUser controller

const router = express.Router();

// Protected Route - Login Route
router.post("/login", loginUser); // Calls the loginUser controller

export default router;
