import z from "zod";

export const getAllCardsSchema = z.strictObject({
  boardId: z.string().min(1, "Board Id is required"),
});

export const createCardSchema = z.strictObject({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false).optional(),
  startDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  labels: z.array(z.string()).optional(),
  boardId: z.string().min(1, "Board Id is required"),
});

export const updateCardSchema = z.strictObject({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  completed: z.boolean().default(false).optional(),
  startDate: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
  assignedTo: z.string().nullable().optional(),
  labels: z.array(z.string()).optional(),
});

export const deleteCardSchema = z.strictObject({
  cardId: z.string().min(1, "Card Id is required"),
});
