import express from "express";

import { readPaymentDetail } from "../controllers/paymentDetail.controller.js";
// import { removePaymentDetailItem} from "../controllers/paymentDetail.controller.js"
// import { getPaymentDetailById } from "../controllers/paymentDetail.controller.js";
import {addPaymentDetail} from "../controllers/paymentDetail.controller.js";


const router = express.Router();

router.get("/", readPaymentDetail);

router.post("/addPaymentDetail", addPaymentDetail)

// router.get("/:id", getPaymentDetailById);

// router.delete("/item/:itemID", removePaymentDetailItem);




export default router;
