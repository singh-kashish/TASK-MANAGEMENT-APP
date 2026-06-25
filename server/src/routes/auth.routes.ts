import { Router } from "express";

import validate from "../middleware/validate.middleware";

import {registerUserSchema,loginUserSchema} from "../validators/auth.validator";

import {registerController,loginController, meController, refreshAuthController, signoutController, signoutAllController} from "../controllers/auth.controllers";
import authMiddleware from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimit.middleware";

const router = Router();

router.post("/register",authLimiter,validate(registerUserSchema,"body"),registerController);

router.post("/login",authLimiter,validate(loginUserSchema,"body"),loginController);

router.get("/me",authMiddleware,meController)

router.post("/refresh",authLimiter,refreshAuthController)

router.post("/signout",authMiddleware,signoutController);
router.post("/signout-all",authMiddleware,signoutAllController);

export default router;