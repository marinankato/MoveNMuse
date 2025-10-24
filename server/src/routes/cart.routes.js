// Shirley
import express from "express";
import { removeCartItem, removeMultipleCartItems, updateCartItem, getCartById, addCartItem} from "../controllers/cart.controller.js"


const router = express.Router();

router.get("/:userId", getCartById);

router.delete("/:cartId/:itemId", removeCartItem);
router.put("/:cartId/:itemId", updateCartItem);

//add item to cart
router.post("/addItem", addCartItem)
router.delete("/removeItems", removeMultipleCartItems);

export default router;
