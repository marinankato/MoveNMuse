import mongoose from "mongoose";
import conf from "../conf/conf.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(conf.MONGODB_URI, {
      //options
    });
    console.log(
      `✅ MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
console.log("MONGO_URI:", conf.MONGODB_URI);

export default connectDB;
