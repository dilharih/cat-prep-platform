import { z } from "zod";

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Name must contain at least 2 characters"),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must contain at least 8 characters"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
