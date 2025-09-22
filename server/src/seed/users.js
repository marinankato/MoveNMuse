// server/seed/users.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/user.model.js";
import path from "path";

// dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), "server/.env") });

const seedUsers = async () => {
  try {
    console.log("DB URL:", process.env.MONGO_DB_URL); // was checking url linked properly
    await mongoose.connect(process.env.MONGO_DB_URL);
    // Optional: clear existing users first
    await User.deleteMany();

    // Add sample users
    const users = [
      {
        firstName: "Alice",
        lastName: "Smith",
        email: "alice@example.com",
        password: "pass123", // plain text for now
        role: "customer",
        phoneNo: "0400000000",
        loginDate: new Date(),
      },
      {
        firstName: "Bob",
        lastName: "Smith",
        email: "admin@example.com",
        password: "admin123", 
        role: "admin",
        phoneNo: "0400000000",
        loginDate: new Date(),
      },
      {
        firstName: "Carol",
        lastName: "Baker",
        email: "staff@example.com",
        password: "staff123", 
        role: "staff",
        phoneNo: "0400000000",
        loginDate: new Date(),
      },
    ];

    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log("✅ Sample users created successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding users:", err.message);
    process.exit(1);
  }

};

seedUsers();
