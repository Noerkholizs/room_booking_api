

import { errorResponse, successResponse } from "@/response";
import { bookingService } from "@/services/booking.service";
import { CreateBookingDto } from "@/types/booking.dto";
import { Response, Request } from 'express';


export const bookingController = {
    createBooking: async (req: Request, res: Response): Promise<void> => {
        try {
            const data : CreateBookingDto = req.body;
    
            const booking = await bookingService.create(data);
    
            successResponse(res, 201, "Booking created successfully", booking);  

        } catch (err: any) {
            errorResponse(res, 400, err.message);
        }
    }

}
