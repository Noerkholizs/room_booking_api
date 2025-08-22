import { prisma } from "@/config/db";
import { BookingStatus } from "../../generated/prisma"; 
import { AppError, ConflictError, NotFoundError, ValidationError } from "@/errors";
import { BookingResponseDto, CreateBookingService, UpdateBookingService } from "@/types/booking.dto";

export const bookingService = {
    getMyBookings: async (userId: number): Promise<BookingResponseDto[]> => {
        const bookings = await prisma.booking.findMany({
            where: {
                userId: userId,
                isDeleted: false
            }
        })

        if (!bookings) {
            throw new NotFoundError("Booking not found")
        }

        return bookings as BookingResponseDto[]
    },

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
                    isDeleted: false,
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
    
            return booking as BookingResponseDto
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Database error in booking service:', error);
            throw new AppError('Failed to create booking');
        }
    },

    update:  async ({ 
        id,
        userId, 
        roomId, 
        startTime, 
        endTime, 
        notes
    } : UpdateBookingService): Promise<BookingResponseDto> => {        

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
                    isDeleted: false,
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
    
            const booking = await prisma.booking.update({
                where: {id: id},
                data: {
                    roomId,
                    userId,
                    startTime: new Date(startTime),
                    endTime: new Date(endTime),
                    notes,
                    status: BookingStatus.SUBMIT,
                },
            });
    
            return booking as BookingResponseDto
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Failed to update booking service:', error);
            throw new AppError('Failed to update booking');
        }
    },

    delete:  async (id: number): Promise<void> => {        
        try {
            const booking = await prisma.booking.findFirst({
                where: { 
                    id: id,
                    isDeleted: false,
                }
            });

            if (!booking) {
                throw new NotFoundError("Booking is not found")
            };

            await prisma.booking.update({
                where: { id: booking.id },
                data: { isDeleted: true }
            });
    

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            console.error('Failed to delete booking service:', error);
            throw new AppError('Failed to delete booking');
        }
    }
}