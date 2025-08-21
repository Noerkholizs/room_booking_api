import { Response } from "express";
import { responses } from "@/response";

export class AppError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500,
        public code: string = "INTERNAL ERROR",
    ) {
        super(message)
        this.name = "AppError"
    }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'RESOURCE_NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'RESOURCE_CONFLICT');
    this.name = 'ConflictError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed', public details?: any) {
    super(message, 422, 'VALIDATION_FAILED');
    this.name = 'ValidationError';
  }
}

export const handleControllerError = (error: unknown, res: Response): void => {
  if (error instanceof NotFoundError) {
    responses.notFound(res, error.message);
    return;
  }

  if (error instanceof ConflictError) {
    responses.conflict(res, error.message);
    return;
  }

  if (error instanceof ValidationError) {
    responses.validationError(res, error.details, error.message);
    return;
  }

  if (error instanceof AppError) {
    responses.internalError(res, error.message);
    return;
  }

  console.error('Unexpected controller error:', error);
  responses.internalError(res, "An unexpected error occurred");
};

export const globalErrorHandler = (
  error: Error, 
  req: Request, 
  res: Response, 
  next: any
) => {
  handleControllerError(error, res);
};