import { Router } from "express";

import validate from "../middleware/validate.middleware";

import {registerUserSchema,loginUserSchema} from "../validators/auth.validator";

import {registerController,loginController} from "../controllers/auth.controllers";

const router = Router();

router.post(
  "/register",validate(registerUserSchema,"body"),registerController);

router.post("/login",validate(loginUserSchema,"body"),loginController);

export default router;