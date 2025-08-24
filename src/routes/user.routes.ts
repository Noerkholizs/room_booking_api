import { authController } from "@/controllers/auth.controller";
import { requireRole, verifyAccessToken } from "@/middleware/auth.middleware";
import { LoginSchema } from "@/types/auth.schema";
import { Router } from "express";

const router = Router();

router.get(
  "/current",
  verifyAccessToken,
  requireRole("USER"),
  authController.register,
);

export default router;
