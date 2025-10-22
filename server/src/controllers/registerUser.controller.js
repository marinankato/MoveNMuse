import User from '../models/user.model.js';
import { getNextUserId } from '../utils/idGenerator.js'; 

export const registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phoneNo } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userId = await getNextUserId(); 

    const newUser = new User({
      userId,
      email,
      password, 
      firstName,
      lastName,
      phoneNo,
      role: "customer",
      loginDate: new Date(),
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
