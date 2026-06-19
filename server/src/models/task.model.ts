import mongoose, { Schema } from "mongoose";

import {
  PRIORITY,
  TASK_STATUS,
} from "../constants/task.constants";

import type { ITask } from "../types/task.types";

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    priority: {
      type: String,
      enum: Object.values(PRIORITY),
      default: PRIORITY.MEDIUM,
    },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },

    dueDate: {
      type: Date,
    }
  },
  {
    timestamps: true,
  }
);


taskSchema.index({
  userId: 1,
  status: 1,
});

taskSchema.index({
  userId: 1,
  priority: 1,
});

taskSchema.index({
  userId: 1,
  dueDate: 1,
});

taskSchema.index({
  userId: 1,
  createdAt: -1,
});
taskSchema.index({
  userId: 1,
  status: 1,
  priority: 1,
});


export const TaskModel = mongoose.model<ITask>(
  "Task",
  taskSchema
);