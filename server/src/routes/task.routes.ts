import { Router } from "express";
import validate from "../middleware/validate.middleware";
import { createTaskSchema, taskFiltersSchema, taskIdSchema, updateTaskSchema } from "../validators/task.validator";
import authMiddleware from "../middleware/auth.middleware";
import { addTaskController, deleteTaskController, getTaskController, getTasksController, updateTaskController } from "../controllers/task.controllers";


const router = Router()
router.use(authMiddleware);

router.post(
  "/",
  validate(createTaskSchema,"body"),
  addTaskController
);

router.get(
  "/",
  validate(taskFiltersSchema,"query"),
  getTasksController
);

router.get(
  "/:taskId",
  validate(taskIdSchema,"params"),
  getTaskController
);

router.patch(
  "/:taskId",
  validate(taskIdSchema,"params"),
  validate(updateTaskSchema,"body"),
  updateTaskController
);

router.delete(
  "/:taskId",
  validate(taskIdSchema,"params"),
  deleteTaskController
);

export default router;