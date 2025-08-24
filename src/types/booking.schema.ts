import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.number({ message: "roomId is required" }),
  startTime:
    z.iso.datetime("startTime must be a valid ISO datetime") || z.string(),
  endTime: z.iso.datetime("endTime must be a valid ISO datetime") || z.string(),
  notes: z.string().max(255).optional(),
});

export const UpdateBookingSchema = z.object({
  roomId: z.number({ message: "roomId is required" }),
  startTime:
    z.iso.datetime("startTime must be a valid ISO datetime") || z.string(),
  endTime: z.iso.datetime("endTime must be a valid ISO datetime") || z.string(),
  notes: z.string().max(255).optional(),
});

export const BookingsQuerySchema = z.object({
  status: z.enum(["SUBMIT", "APPROVED", "REJECTED", "ALL"]).optional(),
  search: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
});

export const AdminUpdateBookingSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
});

export const BookingParamsSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});
