import express from "express";

import { readPaymentDetail, addPaymentDetail } from "../controllers/paymentDetail.controller.js";


const router = express.Router();

router.get("/", readPaymentDetail);

router.post("/addPaymentDetail", addPaymentDetail)





export default router;
