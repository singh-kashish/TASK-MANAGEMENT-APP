import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateTaskInput, TaskIdParams } from "../validators/task.validator";
import { createTask, readTask } from "../services/task.services";
import AppError from "../utils/AppError";
import { AuthenticatedRequest } from "../types/authenticated-request";

export const addTaskController =
  asyncHandler(
    async (
      req:Request,
      res:Response
    ) => {

      const createdTask =
        await createTask(
          req.validated?.body as CreateTaskInput,
          req.auth!.userId
        );

      res.status(201).json({
        success: true,
        data: createdTask,
      });
    }
  );

// export const deleteTaskController = asyncHandler(async(req:Request,res:Response)=>{
//     const deletedTask = await deleteTask(req.validated?.query as TaskIdParams,req.auth!.userId)
//     res.status(204).json({
//         success: true,
//         data: deletedTask,
//     });
// })
export const readTaskController = asyncHandler(async(req:Request,res:Response)=>{
    const getTask = await readTask(req.validated?.params as TaskIdParams)
    res.status(200).json({
        success: true,
        data: getTask,
    });
})
