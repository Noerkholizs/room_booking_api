import { Response } from "express";

export function successResponse(res: Response, status: number, message: string, data?: any) {
  return res.status(status).json({
    error: false,
    status,
    message,
    data: data || null,
  });
}

export function errorResponse(res: Response, status: number, message: string, data?: any) {
  return res.status(status).json({
    error: true,
    status,
    message,
    data: data || null,
  });
}
