import { prisma } from "@/config/db";
import { BookingResponseDto, CreateBookingDto } from "@/types/booking.dto";
import { BookingStatus } from "../../generated/prisma";



export const bookingService = {
    create:  async ({ 
        userId, 
        roomId, 
        startTime, 
        endTime, 
        notes 
    } : CreateBookingDto): Promise<BookingResponseDto> => {
        
        const room = await prisma.room.findUnique({where: {id: roomId}});

        if (!room) {
            throw new Error("Room not found")
        };

        const conflict = await prisma.booking.findFirst({
            where: {
                roomId,
                status: BookingStatus.APPROVED,
                AND: [
                    {startTime: {lt: new Date(endTime)}},
                    {endTime: {gt: new Date(startTime)}},
                ]
            }

        });

        if (conflict) {
            throw new Error("There is a conflict");
        }

        const booking = await prisma.booking.create({
            data: {
                roomId,
                userId,
                startTime: new Date(startTime),
                endTime: new Date(endTime),
                notes,
                status: "SUBMIT"
            }
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
    }
}