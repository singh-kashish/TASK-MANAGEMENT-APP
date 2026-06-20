export interface Task {
  _id: string;
  userId: string;

  title: string;

  description?: string;

  priority:
    | "LOW"
    | "MEDIUM"
    | "HIGH";

  status:
    | "TODO"
    | "IN_PROGRESS"
    | "DONE";

  dueDate?: string;

  createdAt: string;

  updatedAt: string;
}
export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
}