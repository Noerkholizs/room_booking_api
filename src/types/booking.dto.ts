import z from "zod";
import { BookingStatus } from "../../generated/prisma";
import { CreateBookingSchema } from "./booking.schema";

// Request DTOs
export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;

export interface CreateBookingService extends CreateBookingRequest {
    userId: number;
}

export interface UpdateBookingDto {
  startTime?: Date | string;
  endTime?: Date | string;
  notes?: string;
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
}