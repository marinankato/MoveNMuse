import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import conf from "./conf/conf.js";
import Routes from "./routes/index.js";

import courseRoutes from "./routes/course.routes.js"; 
import instructorRoutes from "./routes/instructor.routes.js";
import bookingCourseRoutes from "./routes/bookingCourse.routes.js";


// import roomRoutes from "./routes/room.routes.js";

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
        conf.CORS_ORIGIN1.replace(/\/$/, ""),
        conf.CORS_ORIGIN2.replace(/\/$/, ""),
        conf.CORS_ORIGIN3.replace(/\/$/, ""),
      ];
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

// app.use(
//   cors({
//     origin: ["http://localhost:5173"],   // allow to server to accept requests from this origin
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//   })
// );


app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());


app.use("/api", Routes);


app.use("/api/courses", courseRoutes);
app.use("/api/courses", instructorRoutes);
app.use("/api/bookings", bookingCourseRoutes);


// app.use("/api/rooms", roomRoutes);

app.post("/testing", (req, res) => {
  console.log("Testing");
  res.send("Hello testing completed");
});

app.get("/", (req, res) => {
  res.send("Welcome to the Express Server!");
});

export { app };

