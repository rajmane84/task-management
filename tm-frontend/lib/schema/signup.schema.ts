import z from "zod"

export const signupSchema = z.strictObject({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(32, "Password must be between 6 and 32 characters"),
});


export type SignupInput = z.infer<typeof signupSchema>;