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