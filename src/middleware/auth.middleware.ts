import {JWT_SECRET } from "@/config/env";
import { Role } from "../../generated/prisma";
import { Request, Response, NextFunction } from "express"
import { errorResponse, HTTP_STATUS, responses } from "@/response";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  id: number;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}

const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
    if (!authHeader) {
        return null;
    }

    if (!authHeader.startsWith("Bearer ")) {
        return null
    }

    const token = authHeader.split(" ")[1];
    return token || null;
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            responses.unauthorized(res, "Authentication required. Please provide a valid token.");
            return;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload

        if (!decoded.id || !decoded.email || !decoded.role) {
            responses.unauthorized(res, "Invalid token payload");
            return;
        }

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next()
    } catch (err: any) {
        console.error("Authentication error:", err);
        responses.unauthorized(res, "Authentication failed.");    
    }
};

export const requireRole = (allowedRoles: Role | Role[]) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    console.log("ROLE ===> ", allowedRoles)

    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            responses.unauthorized(res, "Authentication Required");
            return;
        }

        if (!roles.includes(req.user.role)) {
            responses.forbidden(res, `Access denied. Required roles: ${roles.join(', ')}`);
            return;
        }

        next();
    }
}