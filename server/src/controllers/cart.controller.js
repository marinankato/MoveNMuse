import { Cart } from "../models/cart.model.js";
import Course from "../models/course.model.js";
import { CourseSession } from "../models/courseSession.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

async function enrichCartItem(item) {
  // Default shape if it's not a Course
  if (item.productType !== "Course" || !item.productId) {
    return { ...item, product: null, occurrence: null, occurrences: [] };
  }

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

async function enrichCart(cartDoc) {
  if (!cartDoc) return cartDoc;
  const cart = cartDoc.toObject ? cartDoc.toObject() : cartDoc;
  if (!Array.isArray(cart.cartItems) || cart.cartItems.length === 0) return cart;

  const enrichedItems = await Promise.all(cart.cartItems.map(enrichCartItem));
  return { ...cart, cartItems: enrichedItems };
}

// Read cart data, if cart not found, create a new cart
const readCart = async (req, res) => {
  const userId = req.query.userId;

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

  const { cartId, itemId } = req.params; 


  try {
    // Note: Number() is compulsory
    const cart = await Cart.findOne({ cartId: Number(cartId) });

    cart.cartItems = cart.cartItems.filter((item) => item.itemId !== Number(itemId));
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

    return res.status(200).json({ message: "Item updated successfully",  cart: enriched});
  } catch (error) {
    handleError(res, error);
  }
}


// Find cart contents for booking by cart id
const fetchCartByUserId = async (req, res) => {
  const userId = req.params.id;

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

export { readCart, removeCartItem, updateCartItem, fetchCartByUserId as getCartById };
