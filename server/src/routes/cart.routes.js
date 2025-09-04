import express from "express";
import { readCart } from "../controllers/cart.controller.js";
import { removeCartItem} from "../controllers/cart.controller.js"

// import { authenticateUser } from "../middleware/auth.js"; // If you use authentication

const router = express.Router();

router.get("/", readCart);
// router.get("/", authenticateUser, readCart);

router.delete("/item/:itemID", removeCartItem);

export default router;
