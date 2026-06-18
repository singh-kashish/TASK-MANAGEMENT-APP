export const TASK_STATUS = {
  TODO: "TODO",
  IN_PROGRESS: "IN_PROGRESS",
  DONE: "DONE",
} as const;
export type TaskStatus =
  (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export const PRIORITY = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;
export type Priority =
  (typeof PRIORITY)[keyof typeof PRIORITY];
