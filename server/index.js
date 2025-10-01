import dotenv from "dotenv";
dotenv.config();

import { app } from "./src/app.js";
import connectDB from "./src/db/index.js";
import conf from "./src/conf/conf.js";

const PORT = process.env.PORT || conf.PORT || 5000;
const HOST = "0.0.0.0";

process.on("unhandledRejection", (err) => {
  console.error("UnhandledRejection:", err);
});
process.on("uncaughtException", (err) => {
  console.error("UncaughtException:", err);
});



// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`⚙️ Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error?.message || error);
    process.exit(1);
  }
};

startServer();
