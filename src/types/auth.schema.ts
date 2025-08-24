import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "Email required" }),
  password: z.string({ message: "Password is required" }),
});
