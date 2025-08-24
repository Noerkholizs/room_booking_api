import { authController } from "@/controllers/auth.controller";
import { requireRole, verifyAccessToken } from "@/middleware/auth.middleware";
import { LoginSchema } from "@/types/auth.schema";
import { validateRequest } from "@/utils/vadalidation";
import { Router } from "express";

const router = Router();

router.post("/register", authController.register);
router.post("/login", validateRequest({ body: LoginSchema}), authController.login);
router.post("/logout", verifyAccessToken, authController.logout);
router.post("/refresh", authController.refresh);
router.get("/current-user", verifyAccessToken, authController.getCurrentUser);

export default router;