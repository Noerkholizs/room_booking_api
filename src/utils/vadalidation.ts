import { responses } from "@/response";
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateRequest =
  (schemas: { body?: ZodSchema; query?: ZodSchema; params?: ZodSchema }) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        const bodyResult = schemas.body.safeParse(req.body);

        console.log("Body result", bodyResult);
        if (!bodyResult.success) {
          responses.validationError(
            res,
            bodyResult.error.issues,
            "Body validation failed",
          );
          return;
        }
        req.body = bodyResult.data;
      }

      if (schemas.query) {
        const queryResult = schemas.query.safeParse(req.query);

        if (!queryResult.success) {
          responses.validationError(
            res,
            queryResult.error.issues,
            "Query validation failed",
          );
          return;
        }

        req.query = queryResult.data as any;
      }

      if (schemas.params) {
        const paramsResult = schemas.params.safeParse(req.params);

        if (!paramsResult.success) {
          responses.validationError(
            res,
            paramsResult.error.issues,
            "Parameters validation failed",
          );
          return;
        }

        req.params = paramsResult.data as any;
      }

      next();
    } catch (err) {
      console.error("Unexpected validation error:", err);
      responses.internalError(res, "Internal Server Error");
    }
  };
