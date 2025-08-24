import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "@/routes/auth.routes";
import bookingRoutes from "@/routes/booking.routes";
import userRoutes from "@/routes/user.routes";
import adminRoutes from "@/routes/admin.routes";
import roomRoutes from "@/routes/room.routes";

import { PORT } from "./config/env";
// import roomRoutes from "@/routes/room.routes";


const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ],
    credentials: true, // WAJIB true
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Allow-Credentials",
    ],
    // PENTING: Handle preflight
    preflightContinue: false,
    optionsSuccessStatus: 204,
  }),
);

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser())

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/booking", bookingRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/rooms", roomRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Room Booking API is running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
