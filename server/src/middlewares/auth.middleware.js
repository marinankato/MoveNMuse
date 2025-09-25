import conf from "../conf/conf.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Token should be in the format: Bearer <token>
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    console.error("Unauthorized: No token provided");
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, conf.JWT_SECRET);

    req.user = decoded; // Attach decoded token payload to req.user
    next();
  } catch (error) {
    console.error("Unauthorized: Invalid or expired token", error.message);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
