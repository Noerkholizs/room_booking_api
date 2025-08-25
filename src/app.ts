import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { CORS_OPTION } from "./config/env";
import { removeTrailingSlash } from "./utils/helper";

import authRoutes from "@/routes/auth.routes";
import bookingRoutes from "@/routes/booking.routes";
import userRoutes from "@/routes/user.routes";
import adminRoutes from "@/routes/admin.routes";
import roomRoutes from "@/routes/room.routes";
import { responses } from "./response";
import { configDotenv } from "dotenv";

// methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
// allowedHeaders: [
//   "Content-Type",
//   "Authorization",
//   "X-Requested-With",
//   "Accept",
//   "Origin",
//   "Access-Control-Allow-Credentials",
// ],
// preflightContinue: false,
// optionsSuccessStatus: 204,

const allowedDomains = CORS_OPTION.split(', ').filter(Boolean).map(removeTrailingSlash);

const app = express();

app.use(
  cors({
    origin: allowedDomains,
    credentials: true,
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
app.get("/health", (req, res) => {
  responses.ok(res, "Room Booking API is running 🚀");
});

// 404 handler
app.use((req, res, next) => {
  responses.notFound(res, "Route not found");
  next();
})

export default app;
