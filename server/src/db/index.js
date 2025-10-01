import mongoose from "mongoose";
import conf from "../conf/conf.js";

export default async function connectDB() {
  const uri = conf.MONGODB_URI; // make sure this comes from process.env in Azure

  // Fail fast instead of hanging:
  const opts = {
    serverSelectionTimeoutMS: 5000, // give up if no primary is found in 5s
    connectTimeoutMS: 5000,         // TCP connect timeout
    socketTimeoutMS: 20000,         // in-flight ops timeout (20s)
    maxPoolSize: 10,                // sane default
    retryWrites: true,              // good for SRV/Atlas
  };

  try {
    const conn = await mongoose.connect(uri, opts);
    console.log(`✅ MongoDB connected. Host: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err?.message || err);

    process.exit(1);
  }
}