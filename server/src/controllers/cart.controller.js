import { Cart } from "../models/cart.model.js";

// error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

// Read cart data, if cart not found, create a new cart
const ReadCart = async (req, res) => {
  // const cartId = req.cart.userID;
  const userID = "001";

  try {
    let cart = await Cart.findOne({ userID: userID });
    if (!cart) {
      Cart.create({ cartID: "cart_" + userID, userID: userID, items: [] });
      cart = await Cart.findOne({ userID: userID });
    }
    return res.status(200).json(cart);
  } catch (error) {
    handleError(res, error);
  }
};

const UpdateCart = async (req, res) => {
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

export { ReadCart, UpdateCart };
