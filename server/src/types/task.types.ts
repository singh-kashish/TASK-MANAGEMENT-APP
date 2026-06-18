import type { Priority, TaskStatus } from "../constants/task.constants";

import { Types } from "mongoose";

export interface ITask {
  userId: Types.ObjectId;

  title: string;
  description?: string;

  priority: Priority;
  status: TaskStatus;

  dueDate?: Date;
}