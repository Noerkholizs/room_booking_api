import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { errorResponse, successResponse } from "@/response";
import { RegisterDto } from "@/types/auth.dto";

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } : RegisterDto = req.body;
      const user = await authService.register({ name, email, password, role });
      successResponse(res, 201, "User registered successfully", user);
    } catch (err: any) {
      errorResponse(res, 400, err.message);
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      successResponse(res, 200, "Login successful", result);
    } catch (err: any) {
      errorResponse(res, 400, err.message);
    }
  },
};
