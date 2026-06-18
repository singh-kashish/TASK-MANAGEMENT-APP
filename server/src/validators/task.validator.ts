import { z } from "zod";

import { PRIORITY, TASK_STATUS } from "../constants/task.constants";

export const createTaskSchema = z.object({
    title: z.string().trim().min(1, "Title is required").max(200),

    description: z.string().trim().max(2000).optional(),

    priority: z.enum(PRIORITY).default(PRIORITY.MEDIUM),

    status: z.enum(TASK_STATUS).default(TASK_STATUS.TODO),

    dueDate: z.iso.datetime().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();
// Regex below checks hexadecimal string (max 24 characters) as per MongoDb's _id's spec
export const taskIdSchema =
  z.object({
    taskId: z
      .string()
      .regex(
        /^[0-9a-fA-F]{24}$/,
        "Invalid task id"
      ),
});

export const taskFiltersSchema =
  z.object({
    status: z.enum(TASK_STATUS).optional(),

    priority: z.enum(PRIORITY).optional(),

    sortBy: z.enum(["dueDate","createdAt"]).optional(),

    sortOrder: z.enum(["asc","desc"]).optional(),
});

export type CreateTaskInput =
  z.infer<typeof createTaskSchema>;

export type UpdateTaskInput =
  z.infer<typeof updateTaskSchema>;

export type TaskIdParams =
  z.infer<typeof taskIdSchema>;

export type TaskFiltersQuery =
  z.infer<typeof taskFiltersSchema>;