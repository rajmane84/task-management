import z from "zod"

export const loginSchema = z.strictObject({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),
  password: z.string().nonempty("Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;