import { Cart } from "../models/cart.model.js";
import { Course } from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Read cart data, if cart not found, create a new cart
const readCart = async (req, res) => {
  const userId = req.query.userId;

  try {
    let cart = await Cart.findOne({ userId }).lean();
    if (!cart) {
      Cart.create({ cartId: userId, userId: userId, cartItems: [] });
      cart = await Cart.findOne({ userId: userId });
    }
    // Enrich each cart item with course/rooms details
    if (!cart || cart.cartItems.length === 0) {
      return res.status(200).json(cart);
    }
    const enrichedItems = await Promise.all(
      cart.cartItems.map(async (item) => {
        let courseDetails = null;
        let sessionDetails = null;
        let courseSessions = null;

        if (item.productType === "Course" && item.productId) {
          courseDetails = await Course.findOne({ courseId: item.productId });
          sessionDetails = await CourseSession.findOne({
            sessionId: Number(item.occurrenceId),
          });
          courseSessions = await CourseSession.find({
            courseId: item.productId,
          });
        }

        return {
          ...item,
          product: courseDetails ? courseDetails.toObject() : null,
          occurrence: sessionDetails ? sessionDetails.toObject() : null,
          occurrences: courseSessions
            ? courseSessions.map((s) => s.toObject())
            : [],
        };
      })
    );
    cart.cartItems = enrichedItems;
    return res.status(200).json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  const carId = req.query.carId;
  const itemId = Number(req.params.itemId);

  try {
    const cart = await Cart.findOne({ carId: carId });

    cart.items = cart.items.filter((item) => item.itemId !== itemId);
    await cart.save();

    return res.status(200).json({ message: "Item removed successfully", cart });
  } catch (error) {
    handleError(res, error);
  }
};

// Find cart contents for booking by cart id
const getCartById = async (req, res) => {
  const cartId = req.params.id;

  try {
    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

export { readCart, removeCartItem, getCartById };
