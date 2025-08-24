import { handleControllerError } from "@/errors";
import { errorResponse, responses, successResponse } from "@/response";
import { bookingService } from "@/services/booking.service";
import {
  CreateBookingRequest,
  UpdateBookingRequest,
} from "@/types/booking.dto";
import { Response, Request } from "express";

export const bookingController = {
  getMyBookings: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        responses.unauthorized(res, "Authentication required");
        return;
      }

      const booking = await bookingService.getMyBookings(userId);

      responses.ok(res, booking);
    } catch (err) {
      console.error("Failed to create booking", err);
      handleControllerError(err, res);
    }
  },

  create: async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateBookingRequest = req.body;
      const userId = req.user?.id;

      if (!userId) {
        responses.unauthorized(res, "Authentication required");
        return;
      }

      const booking = await bookingService.create({ ...data, userId });

      responses.created(res, booking, "Booking created successfully");
    } catch (err) {
      console.error("Failed to create booking", err);
      handleControllerError(err, res);
    }
  },

  update: async (req: Request, res: Response): Promise<void> => {
    try {
      const data: UpdateBookingRequest = req.body;
      const userId = req.user?.id;
      const { bookingId } = req.params;

      if (!userId) {
        responses.unauthorized(res, "Authentication required");
        return;
      }

      if (!bookingId) {
        responses.badRequest(res, "Booking id is required");
        return;
      }

      const booking = await bookingService.update({
        ...data,
        id: Number(bookingId),
        userId,
      });

      responses.updated(res, booking, "Booking updated successfully");
    } catch (err) {
      console.error("Failed to update booking", err);
      handleControllerError(err, res);
    }
  },

  delete: async (req: Request, res: Response): Promise<void> => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        responses.badRequest(res, "Booking id is required");
        return;
      }

      const booking = await bookingService.delete(Number(bookingId));

      responses.updated(res, booking, "Booking deleted successfully");
    } catch (err) {
      console.error("Failed to deleted booking", err);
      handleControllerError(err, res);
    }
  },
};
