export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;

export const PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type TaskStatus =
  (typeof TASK_STATUS)[keyof typeof TASK_STATUS];

export type TaskPriority =
  (typeof PRIORITY)[keyof typeof PRIORITY];

export interface Task {
  _id: string;
  userId: string;

  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;

  priority: TaskPriority;
  status: TaskStatus;

  dueDate?: string;
}

export interface UpdateTaskPayload
  extends Partial<CreateTaskPayload> {}

export interface TaskFiltersInterface {
  status?: TaskStatus;

  priority?: TaskPriority;

  sortBy?: "createdAt" | "dueDate";

  sortOrder?: "asc" | "desc";
}
