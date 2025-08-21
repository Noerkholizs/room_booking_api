import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "@/routes/auth.routes";
import bookingRoutes from "@/routes/booking.routes";
import { PORT } from "./config/env";
// import roomRoutes from "@/routes/room.routes";

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/booking", bookingRoutes);


// Health check
app.get("/", (req, res) => {
  res.json({ message: "Room Booking API is running 🚀" });
});


app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
