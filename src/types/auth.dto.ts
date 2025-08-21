import z from "zod";
import { Role } from "../../generated/prisma";
import { LoginSchema } from "./auth.schema";



export type LoginRequest = z.infer<typeof LoginSchema>;

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role
}

// Response DTO
export interface AuthResponseDTO {
  token: string;
  user: {
    name: string;
    email: string;
    role: Role;
  };
}
