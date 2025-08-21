import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { errorResponse, responses, successResponse } from "@/response";
import { RegisterDto } from "@/types/auth.dto";
import { handleControllerError } from "@/errors";

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role } : RegisterDto = req.body;
      const user = await authService.register({ name, email, password, role });
      successResponse(res, 201, "User registered successfully", user);
    } catch (err: any) {
      console.error(err.message);
      errorResponse(res, 400, err.message);
    }
  },

  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      responses.ok(res, result, "Login successful")
    } catch (err: any) {
      console.error("Failed to login", err);
      handleControllerError(err, res);
    }
  },
};
