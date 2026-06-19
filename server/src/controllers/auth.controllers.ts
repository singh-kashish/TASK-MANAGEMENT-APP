import { Request, Response } from "express";

import {
  registerUser,
  loginUser,
} from "../services/auth.services";

import {
  RegisterUserInput,
  LoginUserInput,
} from "../validators/auth.validator";

import { refreshCookieOptions } from "../utils/cookies";
import { asyncHandler } from "../utils/asyncHandler";

export const registerController =
  asyncHandler (async(
    req: Request,
    res: Response
  ) => {
    const result =
      await registerUser(
        req.validated
          ?.body as RegisterUserInput
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    });
  });

export const loginController = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const result =
      await loginUser(
        req.validated
          ?.body as LoginUserInput
      );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      refreshCookieOptions
    );

    res.status(200).json({
      success: true,
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    });
  });