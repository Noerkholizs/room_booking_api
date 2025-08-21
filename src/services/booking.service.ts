import { prisma } from "@/config/db";
import { BookingStatus } from "../../generated/prisma"; 
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/errors";
import { BookingResponseDto, CreateBookingService } from "@/types/booking.dto";

export const bookingService = {
    create:  async ({ 
        userId, 
        roomId, 
        startTime, 
        endTime, 
        notes 
    } : CreateBookingService): Promise<BookingResponseDto> => {        

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            throw new ValidationError('Start time must be before end time');
        }

        if (start < new Date()) {
            throw new ValidationError('Cannot book in the past');
        }

        try {
            const room = await prisma.room.findUnique({where: {id: roomId}});

            if (!room) {
                throw new NotFoundError("Room is not Available")
            }

            const conflict = await prisma.booking.findFirst({
                where: {
                    roomId,
                    status: BookingStatus.APPROVED,
                    AND: [
                        {startTime: {lt: end}},
                        {endTime: {gt: start}},
                    ]
                }
    
            });
    
            if (conflict) {
                throw new ConflictError(
                    `Room is already booked from ${conflict.startTime} to ${conflict.endTime}`
                );            
            }
    
            const booking = await prisma.booking.create({
                data: {
                    roomId,
                    userId,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    notes,
                    status: BookingStatus.SUBMIT,
                },
            });
    
            return {
                id: booking.id,
                userId: booking.userId,
                roomId: booking.roomId,
                startTime: booking.startTime,
                endTime: booking.endTime,
                status: booking.status,
                createdAt: booking.createdAt,
                updatedAt: booking.updatedAt,
            };
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Database error in booking service:', error);
            throw new AppError('Failed to create booking');
        }

    }
}