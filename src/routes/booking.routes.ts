import { Router } from "express";
import { checkAuth, requireRole, verifyAccessToken } from "@/middleware/auth.middleware";
import { bookingController } from "@/controllers/booking.controller";
import { validateRequest } from "@/utils/vadalidation";
import {
  BookingParamsSchema,
  CreateBookingSchema,
  BookingsQuerySchema,
  UpdateBookingSchema,
} from "@/types/booking.schema";

const router = Router();

router.post(
  "/create",
  verifyAccessToken,
  requireRole("USER"),
  validateRequest({ body: CreateBookingSchema }),
  bookingController.create,
);

router.get(
  "/my-bookings",
  verifyAccessToken,
  requireRole("USER"),
  validateRequest({ query: BookingsQuerySchema }),
  bookingController.getMyBookings,
);

router.put(
  "/update/:bookingId",
  verifyAccessToken,
  requireRole("USER"),
  validateRequest({
    body: UpdateBookingSchema,
    params: BookingParamsSchema,
  }),
  bookingController.update,
);

router.delete(
  "/delete/:bookingId",
  verifyAccessToken,
  requireRole("USER"),
  validateRequest({
    params: BookingParamsSchema,
  }),
  bookingController.delete,
);

export default router;
