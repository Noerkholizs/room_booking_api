import { prisma } from "@/config/db";
import { BookingStatus } from "../../generated/prisma";
import {
  AppError,
  ConflictError,
  NotFoundError,
  ValidationError,
} from "@/errors";
import {
  BookingResponseDto,
  CreateBookingService,
  BookingsQuery,
  PaginatedBookingResponse,
  UpdateBookingService,
  AdminUpdateBookingRequest,
} from "@/types/booking.dto";

export const adminService = {
  getAdminBookings: async (filters: BookingsQuery): Promise<PaginatedBookingResponse> => {
    const { status, search, page = 1, limit = 10 } = filters;

    const whereClause: any = {
      isDeleted: false,
    };

    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search && search.trim() !== '') {
      whereClause.OR = [
        {
          room: {
            name: {
              contains: search.trim(),
              lte: 'insensitive',
            }
          }
        },
        {
          notes: {
            contains: search.trim(),
            lte: 'insensitive',
          }
        }
      ];
    }

    const skip = (page - 1) * limit;

    const total = await prisma.booking.count({
      where: whereClause,
    });

    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        room: true,
        user: true
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data: bookings as BookingResponseDto[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      }
    };
  },

  updateBookingStatus: async (bookingId: number, status: "APPROVED" | "REJECTED"): Promise<BookingResponseDto> => {
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                id: bookingId
            }
        });

        if (!booking) {
            throw new NotFoundError("Booking is not found")
        }

        const updatedBooking = await prisma.booking.update({
            where: {
                id: booking.id
            },
            data: {
                status: status
            }
        })

        await prisma.booking.updateMany({
          where: {
            status: BookingStatus.SUBMIT,
            isDeleted: false,
            AND: [{ startTime: { lt: updatedBooking.endTime } }, { endTime: { gt: updatedBooking.startTime } }],
          },
          data: {
            status: BookingStatus.REJECTED
          }
        })

        return updatedBooking as BookingResponseDto;
        
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        console.error("Failed to update booking admin service:", error);
        throw new AppError("Failed to update booking admin");
    }
    }
};
