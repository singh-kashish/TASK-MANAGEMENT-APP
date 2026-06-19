import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import AppError from "../utils/AppError";

import {
  CreateTaskInput,
  UpdateTaskInput,
  TaskIdParams,
  TaskFiltersQuery,
} from "../validators/task.validator";

import {
  createTask,
  deleteTask,
  readTask,
  updateTask,
  getTasks,
} from "../services/task.services";

export const addTaskController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const task =
        await createTask(
          req.validated?.body as CreateTaskInput,
          req.auth!.userId
        );

      res.status(201).json({
        success: true,
        data: task,
      });
    }
  );

export const getTaskController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const { taskId } =
        req.validated?.params as TaskIdParams;

      const task =
        await readTask(
          taskId,
          req.auth!.userId
        );

      if (!task) {
        throw new AppError(
          "Task not found",
          404
        );
      }

      res.status(200).json({
        success: true,
        data: task,
      });
    }
  );

export const getTasksController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const tasks =
        await getTasks(
          req.auth!.userId,
          req.validated?.query as TaskFiltersQuery
        );

      res.status(200).json({
        success: true,
        data: tasks,
      });
    }
  );

export const updateTaskController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const { taskId } =
        req.validated?.params as TaskIdParams;

      const updatedTask =
        await updateTask(
          taskId,
          req.auth!.userId,
          req.validated?.body as UpdateTaskInput
        );

      if (!updatedTask) {
        throw new AppError(
          "Task not found",
          404
        );
      }

      res.status(200).json({
        success: true,
        data: updatedTask,
      });
    }
  );

export const deleteTaskController =
  asyncHandler(
    async (
      req: Request,
      res: Response
    ) => {

      const { taskId } =
        req.validated?.params as TaskIdParams;

      const deletedTask =
        await deleteTask(
          taskId,
          req.auth!.userId
        );

      if (!deletedTask) {
        throw new AppError(
          "Task not found",
          404
        );
      }

      res.status(204).send();
    }
  );