import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.number({ message: "roomId is required" }),
  startTime: z.iso.datetime("startTime must be a valid ISO datetime") || z.string(),
  endTime: z.iso.datetime("endTime must be a valid ISO datetime") || z.string(),
  notes: z.string().max(255).optional(),
});

export const UpdateBookingSchema = z.object({
  roomId: z.number({ message: "roomId is required" }),
  startTime: z.iso.datetime("startTime must be a valid ISO datetime") || z.string(),
  endTime: z.iso.datetime("endTime must be a valid ISO datetime") || z.string(),
  notes: z.string().max(255).optional(),
});

export const BookingParamsSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required")
});