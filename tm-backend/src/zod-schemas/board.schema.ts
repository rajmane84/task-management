import z from "zod";

export const createBoardSchema = z.strictObject({
  title: z.string().min(1, "Title is required"),
  background: z
    .strictObject({
      type: z.enum(["color", "image"]).optional(),
      value: z.string().optional(),
    })
    .optional(),
});

export const deleteBoardSchema = z.strictObject({
  id: z.string().min(1, "Board ID is required"),
});

export const updateBoardSchema = z.strictObject({
  title: z.string().min(1, "Title is required").optional(),

  background: z
    .strictObject({
      type: z.enum(["color", "image"]),
      value: z.string().min(1, "Background value is required"),
    })
    .optional(),
});

export const addMemberSchema = z.strictObject({
  userId: z.string().min(1, "User id is required"),
  role: z.enum(["editor", "viewer"]).optional(),
});

export const updateRoleSchema = z.strictObject({
  role: z.enum(["admin", "editor", "viewer"]),
});
