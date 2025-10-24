// Marina
import conf from "../conf/conf.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, conf.JWT_SECRET);

    req.user = decoded; // Attach decoded payload to req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

// Middleware to require a specific user role
export const requireRole = (role) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(403).json({ message: "Access denied: no role found" });
    }

    if (userRole !== role) {
      return res.status(403).json({ message: `Access denied: requires ${role} role` });
    }

    next(); // User has the required role, proceed to next middleware/handler
  };
};

export default authMiddleware;
