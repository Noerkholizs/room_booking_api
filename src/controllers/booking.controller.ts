

import { handleControllerError } from "@/errors";
import { errorResponse, responses, successResponse } from "@/response";
import { bookingService } from "@/services/booking.service";
import { CreateBookingRequest } from "@/types/booking.dto";
import { Response, Request } from 'express';


export const bookingController = {
    createBooking: async (req: Request, res: Response): Promise<void> => {
        try {
            const data : CreateBookingRequest = req.body;
            const userId = req.user?.id;

            if (!userId) {
                responses.unauthorized(res, "Authentication required");
                return;
            }
    
            const booking = await bookingService.create({...data, userId});
    
            responses.created(res, booking, "Booking created successfully");  
        } catch (err) {
            console.error("Failed to create booking", err)
            handleControllerError(err, res);
        }
    }
}
