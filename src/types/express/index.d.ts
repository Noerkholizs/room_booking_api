import { Role } from "../../../generated/prisma";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: Role;
        tokenVersion: number;
      };
      
      validatedQuery?: any;
      validatedBody?: any;
      validatedParams?: any;
    }
  }
}
