import { authController } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router();

console.log("AuthController =>", authController);

router.post("/register", authController.register);
router.post("/login", authController.login);
// router.post("/logout");


export default router;