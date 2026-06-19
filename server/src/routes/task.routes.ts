import { Router } from "express";
import validate from "../middleware/validate.middleware";
import { createTaskSchema, taskIdSchema, updateTaskSchema } from "../validators/task.validator";
import authMiddleware from "../middleware/auth.middleware";
import { addTaskController, readTaskController } from "../controllers/task.controllers";

const router = Router()
router.use(authMiddleware);

router.post(
  '/',
  validate(createTaskSchema,'body'),
  addTaskController
);

router.get(
  '/:taskId',
  validate(taskIdSchema,'params'),
  readTaskController
);

router.patch(
  '/:taskId',
  validate(taskIdSchema,'params'),
  validate(updateTaskSchema,'body')
);

router.delete(
  '/:taskId',
  validate(taskIdSchema,'params')
);

export default router;