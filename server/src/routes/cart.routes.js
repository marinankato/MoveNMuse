import express from "express";
import { ReadCart } from "../controllers/cart.controller.js";
// import { authenticateUser } from "../middleware/auth.js"; // If you use authentication

const router = express.Router();

router.get("/", ReadCart);
// router.get("/", authenticateUser, ReadCart);

export default router;
