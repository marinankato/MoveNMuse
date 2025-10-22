import User from "../models/user.model.js";
import { filterUserData } from './auth.controller.js';

// Common error handler function
const handleError = (res, error) => {
  console.error("Error:", error);
  return res.status(500).json({ message: "Internal Server Error" });
};

const UserViewProfileController = async (req, res) => {
  // console.log("Authenticated user:", req.user);
  const userId = req.user.userId;

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter user data before sending it in the response
    const filteredUser = filterUserData(user);
    res.status(200).json({
      message: "User profile fetched successfully",
      user: filteredUser,
    });
  } catch (error) {
    handleError(res, error);
  }
};

const UserUpdateProfileController = async (req, res) => {
  console.log("req.user:", req.user);

  const userId = req.user.userId;
  const updatedData = req.body;

  try {
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allowedUpdates = ["firstName", "lastName", "email", "phoneNo"];

    allowedUpdates.forEach((field) => {
      if (updatedData[field] !== undefined) {
        user[field] = updatedData[field];
      }
    });

    await user.save();

    // Filter user data before sending it in the response
    const filteredUser = filterUserData(user);
    res.status(200).json({
      message: "User profile updated successfully",
      user: filteredUser,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export { UserViewProfileController, UserUpdateProfileController };
