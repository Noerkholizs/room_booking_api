import jwt from "jsonwebtoken";
import { prisma } from "@/config/db";
import { Role } from "../../generated/prisma";
import { Request, Response, NextFunction } from "express";
import { responses } from "@/response";
import {
  ACCESS_TOKEN_EXPIRY,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
} from "@/config/env";

interface JwtUserPayload {
  id: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  tokenVersion: number;
  type: "access" | "refresh";
}

const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  domain: process.env.COOKIE_DOMAIN,
};

const ACCESS_COOKIE_CONFIG = {
  ...COOKIE_CONFIG,
  maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days
};

const REFRESH_COOKIE_CONFIG = {
  ...COOKIE_CONFIG,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const setAuthCookies = (
  res: Response,
  userId: number,
  role: string,
  tokenVersion: number,
) => {
  const accessToken = jwt.sign(
    { userId, role, tokenVersion, type: "access" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY },
  );

  const refreshToken = jwt.sign(
    { userId, role, tokenVersion, type: "refresh" },
    REFRESH_TOKEN_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY },
  );

  // Set HTTP-only cookies
  res.cookie("accessToken", accessToken, ACCESS_COOKIE_CONFIG);
  res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_CONFIG);

  return { accessToken, refreshToken };
};

// Clear auth cookies
export const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken", COOKIE_CONFIG);
  res.clearCookie("refreshToken", COOKIE_CONFIG);
};

const extractTokenFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader) {
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  return token || null;
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];

    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      responses.unauthorized(
        res,
        "Authentication required. Please provide a valid token.",
      );
      return;
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtUserPayload;

    if (!decoded.id || !decoded.email || !decoded.role) {
      responses.unauthorized(res, "Invalid token payload");
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tokenVersion: 1,
    };

    next();
  } catch (err: any) {
    console.error("Authentication error:", err);
    responses.unauthorized(res, "Authentication failed.");
  }
};

export const requireRole = (allowedRoles: Role | Role[]) => {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      responses.unauthorized(res, "Authentication Required");
      return;
    }

    if (!roles.includes(req.user.role)) {
      responses.forbidden(
        res,
        `Access denied. Required roles: ${roles.join(", ")}`,
      );
      return;
    }

    next();
  };
};

export const verifyAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;


    if (!accessToken) {
      responses.notFound(res, "Access token required");
    }

    const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET) as JWTPayload;

    if (decoded.type !== "access") {
      responses.notFound(res, "Invalid token type");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      clearAuthCookies(res);
      responses.notFound(res, "Token revoked or user not found");
      return;
    }

    req.user = {
      id: user?.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      responses.notFound(res, "Access token expired");
    }

    clearAuthCookies(res);
    responses.notFound(res, "Invalid access token");
  }
};

export const verifyRefreshToken = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      REFRESH_TOKEN_SECRET,
    ) as JWTPayload;

    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      throw new Error("Token revoked or user not found");
    }

    return {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
      tokenVersion: decoded.tokenVersion,
    };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
