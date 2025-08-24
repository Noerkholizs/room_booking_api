import z from "zod";
import { BookingStatus } from "../../generated/prisma";
import { CreateBookingSchema, BookingsQuerySchema, UpdateBookingSchema, AdminUpdateBookingSchema } from "./booking.schema";

export type CreateBookingRequest = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingRequest = z.infer<typeof UpdateBookingSchema>;
export type BookingsQuery = z.infer<typeof BookingsQuerySchema>;
export type AdminUpdateBookingRequest = z.infer<typeof AdminUpdateBookingSchema>;

export interface CreateBookingService extends CreateBookingRequest {
  userId: number;
}
export interface UpdateBookingService extends UpdateBookingRequest {
  id: number;
  userId: number;
}

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

export interface PaginatedBookingResponse {
  data: BookingResponseDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  }
}