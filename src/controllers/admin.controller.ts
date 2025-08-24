import { handleControllerError } from "@/errors";
import { errorResponse, responses, successResponse } from "@/response";
import { adminService } from "@/services/admin.service";
import { bookingService } from "@/services/booking.service";
import {
  CreateBookingRequest,
  BookingsQuery,
  UpdateBookingRequest,
  AdminUpdateBookingRequest,
} from "@/types/booking.dto";
import { Response, Request } from "express";

export const adminController = {
  getAdminBookings: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        responses.unauthorized(res, "Authentication required");
        return;
      }

      const queryParams = req.validatedQuery || req.query;
      const { status, search, page = 1, limit = 10 } = queryParams as BookingsQuery;

      const result = await adminService.getAdminBookings({
        status,
        search,
        page,
        limit,
      });

      responses.ok(res, result.data);
    } catch (err) {
      console.error("Failed to GET ALL booking", err);
      handleControllerError(err, res);
    }
  },

  updateBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;
      const data: AdminUpdateBookingRequest = req.body 
      const { bookingId } = req.params;

      if (!userId) {
        responses.unauthorized(res, "Authentication required");
        return;
      }

      if (!bookingId) {
        responses.badRequest(res, "Booking id is required");
        return;
      }

      const booking = await adminService.updateBookingStatus(Number(bookingId), data.status)

      responses.ok(res, booking, "Booking updated successfully");
    } catch (err) {
        console.error("Failed to update booking", err);
        handleControllerError(err, res);
    }
  },
};
