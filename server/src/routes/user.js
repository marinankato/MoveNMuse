import express from "express";
import User from "../models/user.model.js"; 

const router = express.Router();

router.put("/update", async (req, res) => {
  const userEmail = req.body.email; // Expect email in the request body

  if (!userEmail) {
    return res.status(400).json({ message: "Email is required to update user" });
  }

  try {
    // Remove email from updates to avoid accidentally changing it if you want email to be immutable
    const updates = { ...req.body };
    delete updates.email;

    const updatedUser = await User.findOneAndUpdate(
      { email: userEmail },
      updates,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Failed to update user" });
  }
});

export default router;
