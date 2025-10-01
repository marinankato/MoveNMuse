import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes);

import cartRoutes from "./cart.routes.js";
router.use("/cart", cartRoutes);

import paymentRoutes from "./payment.routes.js";
router.use("/payment", paymentRoutes);

import paymentDetailRoutes from "./paymentDetail.routes.js";
router.use("/paymentDetail", paymentDetailRoutes);

import userRoutes from "./user.js";
router.use("/user", userRoutes);

import bookingRoutes from "./booking.routes.js";
router.use("/bookings", bookingRoutes); 

export default router;
