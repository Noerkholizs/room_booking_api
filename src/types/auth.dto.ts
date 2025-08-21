import { Role } from "../../generated/prisma";

// Request DTOs
export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: Role
}

export interface LoginDto {
  email: string;
  password: string;
}

// Response DTO
export interface AuthResponseDto {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}
