import { Cart } from "../models/cart.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Read cart data, if cart not found, create a new cart
const readCart = async (req, res) => {
  const userEmail = req.query.userEmail;

  try {
    let cart = await Cart.findOne({ userEmail: userEmail });
    if (!cart) {
      Cart.create({ cartID: "cart_" + userEmail, userEmail: userEmail, items: [] });
      cart = await Cart.findOne({ userEmail: userEmail });
    }
    return res.status(200).json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  const cartID = req.query.cartID;
  const itemID = Number(req.params.itemID);

  try {
    const cart = await Cart.findOne({ cartID: cartID });

    cart.items = cart.items.filter((item) => item.itemID !== itemID);
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
