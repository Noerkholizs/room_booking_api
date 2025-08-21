import { authController } from "@/controllers/auth.controller";
import { LoginSchema } from "@/types/auth.schema";
import { validateRequest } from "@/utils/vadalidation";
import { Router } from "express";

const router = Router();

router.post("/register", authController.register);
router.post("/login", validateRequest({ body: LoginSchema}), authController.login);

export default router;