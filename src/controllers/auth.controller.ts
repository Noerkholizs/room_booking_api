import { Request, Response } from "express";
import { authService } from "@/services/auth.service";
import { errorResponse, responses, successResponse } from "@/response";
import { AuthResponseDTO, RegisterDto } from "@/types/auth.dto";
import { handleControllerError } from "@/errors";
import {
  clearAuthCookies,
  setAuthCookies,
  verifyRefreshToken,
} from "@/middleware/auth.middleware";
import { prisma } from "@/config/db";
import bcrypt from "bcryptjs";

export const authController = {
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password, role }: RegisterDto = req.body;
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

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        responses.unauthorized(res, "Invalid credentials");
        return;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        responses.unauthorized(res, "Invalid credentials");
        return;
      }

      setAuthCookies(res, user.id, user.role, user.tokenVersion);

      const result: AuthResponseDTO = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };

      responses.ok(res, result, "Login successful");
    } catch (err: any) {
      console.error("Failed to login", err);
      handleControllerError(err, res);
    }
  },

  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?.id;

      await prisma.user.update({
        where: { id: userId },
        data: { tokenVersion: { increment: 1 } },
      });

      clearAuthCookies(res);

      responses.ok(res, null, "Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      clearAuthCookies(res);
      responses.internalError(res, "Internal Server Error");
    }
  },

  refresh: async (req: Request, res: Response): Promise<void> => {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        responses.unauthorized(res, "Refresh token required");
        return;
      }

      const decoded = await verifyRefreshToken(refreshToken);

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        clearAuthCookies(res);
        responses.unauthorized(res, "User not found");
        return;
      }

      setAuthCookies(res, user.id, user.role, user.tokenVersion);

      const result: AuthResponseDTO = {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };

      responses.ok(res, result, "Refresh token successful");
    } catch (err) {
      console.error("Refresh token error", err);
      responses.unauthorized(res, "Invalid refresh token");
    }
  },

  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        clearAuthCookies(res);
        responses.unauthorized(res, "User not found");
      }

      responses.ok(res, user);
    } catch (err) {
      console.error("Get current user error", err);
      responses.internalError(res, "Internal server error");
    }
  },
};
