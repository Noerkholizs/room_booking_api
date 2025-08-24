import { prisma } from "@/config/db";
import {
  NotFoundError,
} from "@/errors";
import { RoomResponseDto } from "@/types/room.dto";

export const roomService = {
  getAvailableRooms: async (): Promise<RoomResponseDto[]> => {
    const rooms = await prisma.room.findMany({
      where: { 
        isActive: true,
        bookings: {some: {status: "SUBMIT"}}
      },
      include: {
        bookings: {
          where: { status: "SUBMIT" }}
      }
    });

    if (!rooms) {
      throw new NotFoundError("Booking not found");
    }

    return rooms as RoomResponseDto[];
  },
};
