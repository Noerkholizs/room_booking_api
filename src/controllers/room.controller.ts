import { handleControllerError } from "@/errors";
import { responses } from "@/response";
import { roomService } from "@/services/room.service";
import { Response, Request } from "express";

export const roomController = {
  getAvailableRooms: async (req: Request, res: Response): Promise<void> => {
    try {
      const rooms = await roomService.getAvailableRooms();
      responses.ok(res, rooms);
    } catch (err) {
      console.error("Failed to get rooms", err);
      handleControllerError(err, res);
    }
  },
};
