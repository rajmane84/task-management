import z from "zod";

export const createBoardSchema = z.strictObject({
  title: z.string().min(1, "Title is required"),
  background: z.string().optional(),
});

export const deleteBoardSchema = z.strictObject({
  id: z.string().min(1, "Board ID is required"),
});
