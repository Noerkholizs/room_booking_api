import {JWT_SECRET } from "@/config/env";
import { Role } from "../../generated/prisma";
import { Request, Response, NextFunction } from "express"
import { errorResponse } from "@/response";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  id: number;
  email: string;
  role: Role;
}

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return errorResponse(res, 401, "No toke provided");
        };

        const token = authHeader.split(" ")[1]!;
        const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;

        // req.user = {
        //     id: decoded.id,
        //     email: decoded.email,
        //     role: decoded.role,
        // };

        return next()
        
    } catch (err: any) {
        return errorResponse(res, 401, "Invalid or expired token");
    }
};