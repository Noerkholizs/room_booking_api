import { Router } from "express";
import { checkAuth, requireRole } from "@/middleware/auth.middleware";
import { bookingController } from "@/controllers/booking.controller";
import { validateRequest } from "@/utils/vadalidation";
import { BookingParamsSchema, CreateBookingSchema, UpdateBookingSchema } from "@/types/booking.schema";

const router = Router();

router.post("/", 
    checkAuth, 
    requireRole("USER"), 
    validateRequest({body: CreateBookingSchema}), 
    bookingController.create
);

router.get("/my-bookings", 
    checkAuth, 
    requireRole("USER"), 
    bookingController.getMyBookings
);

router.put("/update/:bookingId", 
    checkAuth, 
    requireRole("USER"), 
    validateRequest({
        body: UpdateBookingSchema, 
        params: BookingParamsSchema
    }), 
    bookingController.update
);

router.delete("/delete/:bookingId", 
    checkAuth, 
    requireRole("USER"), 
    validateRequest({
        params: BookingParamsSchema
    }), 
    bookingController.delete
);

export default router;