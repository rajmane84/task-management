import z from "zod";

export const createCardSchema = z.strictObject({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    completed: z.boolean().default(false),
    startDate: z.string().optional(),
    dueDate: z.string().optional(),
    assignedTo: z.string().optional(),
    labels: z.array(z.string()).optional(),
    boardId: z.string().nonoptional("Board Id is required")
})