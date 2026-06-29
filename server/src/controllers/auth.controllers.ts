import { Request, Response } from "express";
import {registerUser,loginUser,deleteAndCreateRefreshToken, signoutUser, signoutAllService,} from "../services/auth.services";
import {RegisterUserInput,LoginUserInput} from "../validators/auth.validator";
import { refreshCookieOptions } from "../utils/cookies";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyRefreshToken } from "../utils/jwt";
import UserModel from "../models/user.model";
import { hashRefreshToken, rotateRefreshToken } from "../utils/tokenUtils";
import AppError from "../utils/AppError";

export const registerController =
  asyncHandler (
    async(
    req: Request,
    res: Response
  ) => {
    const result = await registerUser(req.validated?.body as RegisterUserInput);
    res.cookie("refreshToken",result.refreshToken,refreshCookieOptions);
    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        accessToken:
          result.accessToken,
      },
    });
  }
);

export const loginController = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {
    const result = await loginUser(req.validated?.body as LoginUserInput);
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

  export const meController = asyncHandler(async(req:Request,res:Response)=>{
    res.set("Cache-Control", "no-store");
    res.json(req.auth)
  })

export const refreshAuthController = asyncHandler(
  async (req: Request, res: Response) => {
    const oldRefreshToken = req.cookies["refreshToken"];
    if (!oldRefreshToken) {
      throw new AppError("No refresh token", 401);
    }
    // 1) Verify the refresh token signature & payload
    const payload = verifyRefreshToken(oldRefreshToken);
    // 2) Hash the presented token
    const oldHash = hashRefreshToken(oldRefreshToken);
    // 3) Make sure this user exists and still has this non‑expired token
    const user = await UserModel.findOne({
      _id: payload.userId,
      refreshTokens: {
        $elemMatch: {
          tokenHash: oldHash,
          expiresAt: { $gt: new Date() },
        },
      },
    });
    if (!user) {
      throw new AppError("Invalid or expired refresh token", 401);
    }
    // 4) Atomically rotate the refresh token in DB and issue new tokens
    const { accessToken, refreshToken } = await rotateRefreshToken(
      oldHash,
      user
    );
    // 5) Update cookie with the new refresh token
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);
    // 6) Return new access token + user
    res.status(200).json({
      message: "Refresh completed",
      data: {
        accessToken,
      },
    });
  }
);

export const signoutController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.auth.userId;
    const refreshToken = req.cookies["refreshToken"];
    if (refreshToken) {
      await signoutUser(userId, refreshToken);
    }
    res.cookie("refreshToken", "", {
      ...refreshCookieOptions,
      maxAge: 0,
    });
    res.status(204).send(); 
  }
);

export const signoutAllController = asyncHandler(async(req:Request,res:Response)=>{
  const userId = req.auth!.userId;
  await signoutAllService(userId);
  res.cookie("refreshToken", "", {
      ...refreshCookieOptions,
      maxAge: 0,
  });
  res.status(204).send()
})
