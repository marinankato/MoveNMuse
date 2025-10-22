import express from "express";
const router = express.Router();

import authRoutes from "./auth.routes.js";
router.use("/auth", authRoutes);

import cartRoutes from "./cart.routes.js";
router.use("/cart", cartRoutes);

import paymentRoutes from "./payment.routes.js";
router.use("/payment", paymentRoutes);

import roomRoutes from "./room.routes.js";
router.use("/rooms", roomRoutes);

import paymentDetailRoutes from "./paymentDetail.routes.js";
router.use("/paymentDetail", paymentDetailRoutes);

import userRoutes from "./user.js";
router.use("/user", userRoutes);

import bookingRoutes from "./booking.routes.js";
router.use("/bookings", bookingRoutes); 

import bookingCourseRoutes from "./bookingCourse.routes.js";
router.use("/bookingCourses", bookingCourseRoutes);

import courseRoutes from "./course.routes.js";
router.use("/courses", courseRoutes);

import accountRoutes from "./account.routes.js";
router.use("/account", accountRoutes);

export default router;
