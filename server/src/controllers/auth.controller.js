import conf from "../conf/conf.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";  
import dotenv from "dotenv";
dotenv.config();

export const filterUserData = (user) => ({
  id: user.userId,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  phoneNo: user.phoneNo,
  loginDate: user.loginDate,
  logoutDate: user.logoutDate,
});

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    console.log("Found user:", user);

    if (!user || user.password !== password) {
      console.log("Invalid credentials");
      return res.status(401).json({ message: "Invalid email or password." });
    }

    user.loginDate = new Date();
    await user.save();

    // Create payload for token (include any data you want to encode)
    const payload = {
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNo: user.phoneNo,
      role: user.role,
    };

    const token = jwt.sign(payload, conf.JWT_SECRET, { expiresIn: "2h" });
    console.log("Token generated:", token);

    return res.status(200).json({
      message: "Login successful",
      token, // Include the token in the response
      user: filterUserData(user),
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
