import z from "zod";
import { capitalizeEachWord } from "../utils/captalize";

export const loginSchema = z.strictObject({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export const signupSchema = z.strictObject({
  name: z
    .string()
    .min(3, "Name must be of at least 3 characters")
    .trim()
    .transform((val) => capitalizeEachWord(val))
    .nonoptional("Name is required"),
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be between 6 and 32 characters"),
});

export const forgotPasswordSchema = z.strictObject({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
});

export const resetPasswordSchema = z.strictObject({
  token: z.string().nonempty("Token is required"),
  newPassword: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be between 6 and 32 characters"),
});
