import { z } from "zod";

const MAX_PASSWORD_LENGTH = 128;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters").max(100, "Name is too long"),
    email: z.email("Please enter a valid email address").max(254, "Email is too long"),
    password: z
      .string()
      .min(15, "Password must contain at least 15 characters")
      .max(MAX_PASSWORD_LENGTH, "Password must contain at most 128 characters"),
    confirmPassword: z
      .string()
      .min(15, "Please confirm your password")
      .max(MAX_PASSWORD_LENGTH, "Password must contain at most 128 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
