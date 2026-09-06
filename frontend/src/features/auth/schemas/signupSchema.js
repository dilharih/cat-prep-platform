import { z } from "zod";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters").max(100, "Name is too long"),
    email: z.email("Please enter a valid email address").max(254, "Email is too long"),
    password: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "Password must contain at least 8 characters")
      .max(MAX_PASSWORD_LENGTH, "Password must contain at most 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one symbol"),
    confirmPassword: z
      .string()
      .min(MIN_PASSWORD_LENGTH, "Please confirm your password")
      .max(MAX_PASSWORD_LENGTH, "Password must contain at most 128 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
