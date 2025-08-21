import { Router } from "express";
import { checkAuth, requireRole } from "@/middleware/auth.middleware";
import { bookingController } from "@/controllers/booking.controller";
import { validateRequest } from "@/utils/vadalidation";
import { CreateBookingSchema } from "@/types/booking.schema";

const router = Router();

router.post("/", 
    checkAuth, 
    requireRole("USER"), 
    validateRequest({body: CreateBookingSchema}), 
    bookingController.createBooking
);

export default router;