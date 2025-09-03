import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes);
import cartRoutes from "./cart.routes.js";
router.use("/cart", cartRoutes);

export default router;
