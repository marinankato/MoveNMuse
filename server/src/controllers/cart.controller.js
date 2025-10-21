import { Cart } from "../models/cart.model.js";
import Course from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";
import Room from "../models/room.model.js";
import  RoomSlot from "../models/roomSlot.model.js"; 

// error handler function
const handleError = (res, error)=> {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

async function enrichCartItem(item) {
  if (item.productType == "Room") {
    const [roomDetails, slotDetails, roomSlots] = await Promise.all([
      Room.findOne({ roomId: item.productId }).lean(),
      RoomSlot.findOne({ roomId: item.productId, roomSlotId: Number(item.occurrenceId) }).lean(),
      RoomSlot.find({ roomId: item.productId }).lean(),
    ]);
    console.log("item.occurrenceId:", item.occurrenceId);
    console.log("slotDetails:", slotDetails);

    return {
      ...item,
      product: roomDetails ?? null,
      occurrence: slotDetails ?? null,
      occurrences: (roomSlots ?? []).map((s) => s),
    };
  }

  if (item.productType == "Course") {
    const [courseDetails, sessionDetails, courseSessions] = await Promise.all([
      Course.findOne({ courseId: item.productId }).lean(),
      CourseSession.findOne({ sessionId: Number(item.occurrenceId) }).lean(),
      CourseSession.find({ courseId: item.productId }).lean(),
    ]);

    return {
      ...item,
      product: courseDetails ?? null,
      occurrence: sessionDetails ?? null,
      occurrences: (courseSessions ?? []).map((s) => s),
    };
  }
}

// Enrich cart with product and occurrence details
async function enrichCart(cartDoc) {
  if (!cartDoc) return cartDoc;
  const cart = cartDoc.toObject ? cartDoc.toObject() : cartDoc;
  if (!Array.isArray(cart.cartItems) || cart.cartItems.length === 0)
    return cart;

  const enrichedItems = await Promise.all(cart.cartItems.map(enrichCartItem));
  return { ...cart, cartItems: enrichedItems };
}

// Read cart data, if cart not found, create a new cart
const getCartById = async (req, res) => {
  const userId = req.params.userId;

  try {
    let cart = await Cart.findOne({ userId }).lean();
    // If no cart, create one
    if (!cart) {
      Cart.create({ cartId: userId, userId: userId, cartItems: [] });
      cart = await Cart.findOne({ userId: userId });
    }
    // Enrich each cart item with course/rooms details
    if (!cart || cart.cartItems.length === 0) {
      return res.status(200).json(cart);
    }
    const enriched = await enrichCart(cart);
    return res.status(200).json(enriched);
  } catch (error) {
    handleError(res, error);
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  const { cartId, itemId } = req.params;

  try {
    // Note: Number() is compulsory
    const cart = await Cart.findOne({ cartId: Number(cartId) });

    cart.cartItems = cart.cartItems.filter(
      (item) => item.itemId !== Number(itemId)
    );
    await cart.save();

    return res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    handleError(res, error);
  }
};

const updateCartItem = async (req, res) => {
  const { cartId, itemId } = req.params;
  const { occurrenceId } = req.body;

  try {
    // Note: Number() is compulsory
    const updated = await Cart.findOneAndUpdate(
      { cartId: String(cartId), "cartItems.itemId": itemId },
      { $set: { "cartItems.$.occurrenceId": occurrenceId } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Cart not found" });

    const enriched = await enrichCart(updated);

    return res
      .status(200)
      .json({ message: "Item updated successfully", cart: enriched });
  } catch (error) {
    handleError(res, error);
  }
};


export {

  removeCartItem,
  updateCartItem,
  getCartById,
};
