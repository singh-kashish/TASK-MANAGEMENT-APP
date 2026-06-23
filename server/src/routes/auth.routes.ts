import { Router } from "express";

import validate from "../middleware/validate.middleware";

import {registerUserSchema,loginUserSchema} from "../validators/auth.validator";

import {registerController,loginController, meController, refreshAuthController, signoutController} from "../controllers/auth.controllers";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.post(
  "/register",validate(registerUserSchema,"body"),registerController);

router.post("/login",validate(loginUserSchema,"body"),loginController);

router.get("/me",authMiddleware,meController)

router.post("/refresh",refreshAuthController)

router.post("/signout",authMiddleware,signoutController);
export default router;