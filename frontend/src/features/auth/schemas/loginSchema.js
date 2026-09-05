import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email address")
    .max(254, "Email is too long"),

  password: z
    .string()
    .min(1, "Please enter your password")
    .max(128, "Password is too long"),
});
