import { BookingStatus } from "../../generated/prisma";

// Request DTOs
export interface CreateBookingDto {
    userId: number;
    roomId: number;
    startTime: Date | string;
    endTime: Date | string;
    notes?: string;
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