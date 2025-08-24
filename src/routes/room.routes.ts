import { Router } from "express";
import { requireRole, verifyAccessToken } from "@/middleware/auth.middleware";
import { roomController } from "@/controllers/room.controller";

const router = Router();

router.get(
  "/",
  verifyAccessToken,
  requireRole("USER"),
  roomController.getAvailableRooms,
);

export default router;
