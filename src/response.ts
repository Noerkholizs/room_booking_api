import { Response } from "express";

interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  timestamp: string;
  path?: string;
}

interface ApiErrorResponse extends Omit<ApiResponse, 'data'> {
  success: false;
  error: {
    code: string;
    details: any;
  }
}

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

// ✅ Error codes untuk konsistensi
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
} as const;

export function successResponse<T = any>(
  res: Response,
  statusCode: number = HTTP_STATUS.OK,
  message: string = "Success",
  data?: T,
  options?: { path: string }
): Response<ApiResponse<T>>{
  const response: ApiResponse<T> = {
    success: true,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    ...(options?.path && { path: options.path }),
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  };


  return res.status(statusCode).json(response);
};

export function errorResponse(
  res: Response,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  message: string = 'An error occurred',
  errorCode: string = ERROR_CODES.INTERNAL_ERROR,
  details?: any,
  options?: { path?: string }
): Response<ApiErrorResponse> {
  const response: ApiErrorResponse = {
    success: false,
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    error: {
      code: errorCode,
      ...(details && { details }),
    },
    ...(options?.path && { path: options.path }),
  };

  if (statusCode >= 500) {
    console.error(`[ERROR] ${statusCode} - ${message}`, {
      errorCode,
      details,
      timestamp: response.timestamp,
      path: options?.path,
    });
  }

  return res.status(statusCode).json(response);
};


export const responses = {
  // Success responses
  ok: <T>(res: Response, data?: T, message: string = 'Success') =>
    successResponse(res, HTTP_STATUS.OK, message, data),
  
  created: <T>(res: Response, data?: T, message: string = 'Resource created successfully') =>
    successResponse(res, HTTP_STATUS.CREATED, message, data),
  
  updated: <T>(res: Response, data?: T, message: string = 'Resource updated successfully') =>
    successResponse(res, HTTP_STATUS.CREATED, message, data),
  
  noContent: (res: Response, message: string = 'No content') =>
    successResponse(res, HTTP_STATUS.NO_CONTENT, message),

  // Error responses
  badRequest: (res: Response, message: string = 'Bad request', details?: any) =>
    errorResponse(res, HTTP_STATUS.BAD_REQUEST, message, ERROR_CODES.VALIDATION_FAILED, details),
  
  unauthorized: (res: Response, message: string = 'Unauthorized access') =>
    errorResponse(res, HTTP_STATUS.UNAUTHORIZED, message, ERROR_CODES.UNAUTHORIZED_ACCESS),
  
  forbidden: (res: Response, message: string = 'Forbidden') =>
    errorResponse(res, HTTP_STATUS.FORBIDDEN, message, ERROR_CODES.UNAUTHORIZED_ACCESS),
  
  notFound: (res: Response, message: string = 'Resource not found') =>
    errorResponse(res, HTTP_STATUS.NOT_FOUND, message, ERROR_CODES.RESOURCE_NOT_FOUND),
  
  conflict: (res: Response, message: string = 'Resource already exists', details?: any) =>
    errorResponse(res, HTTP_STATUS.CONFLICT, message, ERROR_CODES.DUPLICATE_RESOURCE, details),
  
  validationError: (res: Response, details: any, message: string = 'Validation failed') =>
    errorResponse(res, HTTP_STATUS.UNPROCESSABLE_ENTITY, message, ERROR_CODES.VALIDATION_FAILED, details),
  
  internalError: (res: Response, message: string = 'Internal server error', details?: any) =>
    errorResponse(res, HTTP_STATUS.INTERNAL_SERVER_ERROR, message, ERROR_CODES.INTERNAL_ERROR, details),
};

// ✅ Middleware untuk menambahkan path ke response (opsional)
export const addRequestPath = (req: any, res: Response, next: any) => {
  res.locals.requestPath = req.originalUrl || req.url;
  next();
};
