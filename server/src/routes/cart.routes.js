import express from "express";


import { readCart } from "../controllers/cart.controller.js";
import { removeCartItem} from "../controllers/cart.controller.js"
import { updateCartItem} from "../controllers/cart.controller.js"
import { getCartById } from "../controllers/cart.controller.js";


const router = express.Router();

router.get("/", readCart);
router.get("/:id", getCartById);

router.delete("/:cartId/:itemId", removeCartItem);
router.put("/:cartId/:itemId", updateCartItem);

export default router;
