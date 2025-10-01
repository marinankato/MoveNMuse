import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import conf from "./conf/conf.js";
import Routes from "./routes/index.js";
import roomRoutes from "./routes/room.routes.js";
import courseRoutes from "./routes/course.routes.js";
import bookingCourseRoutes from "./routes/bookingCourse.routes.js";

const app = express();

app.use(bodyParser.json());

// app.use(
//   cors({
//     origin: conf.CORS_ORIGIN.replace(/\/$/, ""),
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   })
// );

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        conf.CORS_ORIGIN1,
        conf.CORS_ORIGIN2,
        conf.CORS_ORIGIN3,
        process.env.WEBSITE_HOSTNAME &&
          `https://${process.env.WEBSITE_HOSTNAME}`,
      ]
        .map(normalize)
        .filter(Boolean);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/rooms", roomRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/bookings", bookingCourseRoutes);

app.post("/testing", (req, res) => {
  console.log("Testing");
  res.send("Hello testing completed");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

export { app };
