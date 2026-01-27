import z from "zod";

export const updateUserSchema = z.object({
  name: z.string().min(3, "Name must be of atleast 3 characters").optional(),
  username: z
    .string()
    .min(3, "Username must be of atleast 3 characters")
    .optional(),
  email: z.string().email("Invalid email address").optional(),
  bio: z.string().optional(),
});

export const checkUsernameSchema = z.object({
    username: z
    .string()
    .min(3, "Username must be of atleast 3 characters")
    .nonoptional("Username is required"),
})
