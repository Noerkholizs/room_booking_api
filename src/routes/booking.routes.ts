import { Router } from "express";
import { checkAuth } from "@/middleware/auth.middleware";
import { bookingController } from "@/controllers/booking.controller";

const router = Router();

router.post("/", checkAuth, bookingController.createBooking);

export default router;