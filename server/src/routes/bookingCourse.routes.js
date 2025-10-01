import { Router } from "express";
import { createBooking, listBookingsByUser, cancelBooking } from "../controllers/bookingCourse.controller.js";

const router = Router();

router.post("/", createBooking);                     // 创建预订
router.get("/user/:userId", listBookingsByUser);     // 用户所有预订
router.patch("/:id/cancel", cancelBooking);          // 取消预订

export default router;
