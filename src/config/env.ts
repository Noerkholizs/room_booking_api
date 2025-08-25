import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT!;
export const DATABASE_URL = process.env.DATABASE_URL!;
export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
export const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;
export const CORS_OPTION = process.env.CORS_ORIGIN!;
export const ACCESS_TOKEN_EXPIRY = "5d";
export const REFRESH_TOKEN_EXPIRY = "7d";
