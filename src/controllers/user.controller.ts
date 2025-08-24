import { Request, Response } from "express";
import { prisma } from "@/config/db";
import { clearAuthCookies } from "@/middleware/auth.middleware";
import { responses } from "@/response";

export const userController = {
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
