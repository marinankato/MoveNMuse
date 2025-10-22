import express from "express";

import { processPayment,getPaymentHistoryById, getAllPayments } from "../controllers/payment.controller.js";
import { get } from "mongoose";

const router = express.Router();

router.post("/processPayment", processPayment);

router.get("/getPayments", getPaymentHistoryById)
router.get("/getAllPayments", getAllPayments);


export default router;
