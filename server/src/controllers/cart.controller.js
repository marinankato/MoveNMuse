import { Cart } from "../models/cart.model.js";



// Common error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

const CartViewProfileController = async (req, res) => {
  const cartId = req.cart.uid;

  try {
    const cart = await Cart.findOne({ uid: cartId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

  } catch (error) {
    handleError(res, error);
  }
};

const CartUpdateProfileController = async (req, res) => {
  const cartId = req.cart.uid;
  const updatedData = req.body;

  try {
    const cart = await Cart.findOne({ uid: cartId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const allowedUpdates = [
      "name",
      "age",
      "gender",
      "address",
      "phone",
      "picture",
    ];

    allowedUpdates.forEach((field) => {
      if (updatedData[field] !== undefined) {
        cart[field] = updatedData[field];
      }
    });

    await cart.save();

    // Filter cart data before sending it in the response
    const filteredCart = filterCartData(cart);
    res.status(200).json({
      message: "Cart profile updated successfully",
      cart: filteredCart,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export { CartViewProfileController, CartUpdateProfileController };

