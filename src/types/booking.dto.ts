import z from "zod";
import { BookingStatus } from "../../generated/prisma";
import { CreateBookingSchema, UpdateBookingSchema } from "./booking.schema";

// Request DTOs
export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingRequest = z.infer<typeof UpdateBookingSchema>;

export interface CreateBookingService extends CreateBookingRequest {
  userId: number;
}
export interface UpdateBookingService extends UpdateBookingRequest {
  id: number;
  userId: number;
}

// Response DTO
export interface BookingResponseDto {
  id: number;
  roomId: number;
  userId: number;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  isDeleted: boolean;
}