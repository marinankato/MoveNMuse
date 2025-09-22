import User from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const filterUserData = (user) => ({
  id: user._id,
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

    console.log("Login successful");
    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,    
        phoneNo: user.phoneNo,     
        role: user.role,  
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    return res.status(500).json({ message: "Server error." });
  }
};
