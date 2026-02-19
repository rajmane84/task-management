import z from "zod";

export const createLinkSchema = z.object({
  targetId: z.string().nonempty("Target ID is required"),
  role: z
    .enum(["viewer", "editor"], "Role must be either 'viewer' or 'editor'")
    .default("viewer"),
  expiresAt: z
    .string()
    .optional()
    .refine(
      (dateStr) => {
        if (!dateStr) return true; // allow undefined
        const date = new Date(dateStr);
        return !isNaN(date.getTime()) && date > new Date();
      },
      {
        message: "Expiration date must be a valid future date",
      },
    ),
  maxUses: z.number().int().positive().optional(),
});
