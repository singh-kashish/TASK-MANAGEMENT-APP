import { TaskModel } from "../models/task.model";

import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskFiltersQuery,
} from "../validators/task.validator";

export const createTask = async (
  input: CreateTaskInput,
  userId: string
) => {

  return TaskModel.create({
    userId,
    title: input.title,
    ...(input.description && {
      description: input.description,
    }),
    ...(input.priority && {
      priority: input.priority,
    }),
    ...(input.status && {
      status: input.status,
    }),
    ...(input.dueDate && {
      dueDate: new Date(
        input.dueDate
      ),
    }),
  });
};

export const readTask = async (
  taskId: string,
  userId: string
) => {

  return TaskModel.findOne({
    _id: taskId,
    userId,
  });
};

export const updateTask = async (
  taskId: string,
  userId: string,
  input: UpdateTaskInput
) => {

  const updateData = {
    ...input,

    ...(input.dueDate && {
      dueDate: new Date(
        input.dueDate
      ),
    }),
  };

  return TaskModel.findOneAndUpdate(
    {
      _id: taskId,
      userId,
    },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
};

export const deleteTask = async (
  taskId: string,
  userId: string
) => {

  return TaskModel.findOneAndDelete({
    _id: taskId,
    userId,
  });
};

export const getTasks = async (
  userId: string,
  filters: TaskFiltersQuery
) => {

  const query: Record<string, unknown> = {
    userId,
  };

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.priority) {
    query.priority = filters.priority;
  }

  const sortField =
    filters.sortBy ?? "createdAt";

  const sortOrder =
    filters.sortOrder === "asc"
      ? 1
      : -1;

  return TaskModel
    .find(query)
    .sort({
      [sortField]: sortOrder,
    })
    .lean();
};