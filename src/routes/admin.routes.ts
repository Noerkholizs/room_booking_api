import { Router } from "express";
import { requireRole, verifyAccessToken } from "@/middleware/auth.middleware";
import { bookingController } from "@/controllers/booking.controller";
import { validateRequest } from "@/utils/vadalidation";
import {
  AdminUpdateBookingSchema,
  BookingParamsSchema,
  BookingsQuerySchema,
} from "@/types/booking.schema";
import { adminController } from "@/controllers/admin.controller";

const router = Router();

router.get(
  "/bookings",
    verifyAccessToken,
    requireRole("ADMIN"),
    validateRequest({ query: BookingsQuerySchema }),
    adminController.getAdminBookings,
);

router.put(
  "/bookings/:bookingId/status",
    verifyAccessToken,
    requireRole("ADMIN"),
    validateRequest({ body: AdminUpdateBookingSchema, params: BookingParamsSchema }),
    adminController.updateBooking,
);

export default router;
