import UserModel from "../models/user.model";
import AppError from "../utils/AppError";
import {
  hashPassword,
  comparePassword,
} from "../utils/password";
import { issueTokens, revokeAllRefreshTokens, storeRefreshToken } from "../utils/tokenUtils";
import { buildAuthResponse } from "../utils/authResponse";
import type {RegisterUserInput,LoginUserInput,JwtPayload} from "../validators/auth.validator";
import { ObjectId } from "mongoose";
import { generateRefreshToken } from "../utils/jwt";
import { hashRefreshToken } from "../utils/tokenUtils";

export const registerUser = async (input: RegisterUserInput) => {
  const existingUser = await UserModel.findOne({ email: input.email});
  if (existingUser) {throw new AppError("User already exists",409)}
  const passwordHash = await hashPassword(input.password);
  try {
    const user = await UserModel.create({email: input.email,passwordHash});
    const {accessToken,refreshToken} = await issueTokens(user);
    await storeRefreshToken(user._id.toString(),refreshToken);
    return buildAuthResponse(user,accessToken,refreshToken);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      throw new AppError(
        "User already exists",
        409
      );
    }
    throw error;
  }
};

export const loginUser = async (
  input: LoginUserInput
) => {
  const user = await UserModel.findOne({email: input.email});
  if (!user) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }
  const passwordValid = await comparePassword(input.password,user.passwordHash);
  if (!passwordValid) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }
  const {
    accessToken,
    refreshToken,
  } = await issueTokens(user);
  await storeRefreshToken(user._id.toString(),refreshToken);
  return buildAuthResponse(
    user,
    accessToken,
    refreshToken
  );
};

export const deleteAndCreateRefreshToken = async (oldRefreshTokenHash:string,user:InstanceType<typeof UserModel>)=>{
  const {accessToken,refreshToken,} = await issueTokens(user)
  let result = await UserModel.findByIdAndUpdate(
  {
    _id: user._id,
    refreshTokens:
      oldRefreshTokenHash,
  },
  {
    $pull: {
      refreshTokens:
        oldRefreshTokenHash,
    }
  }
);
return {accessToken,refreshToken};
}

export const signoutUser = async (userId: string, refreshToken: string) => {
  if (!refreshToken) return;
  const tokenHash = hashRefreshToken(refreshToken);
  await UserModel.updateOne(
    { _id: userId },
    {
      $pull: {
        refreshTokens: { tokenHash },
      },
    }
  );
};

export const signoutAllService = async(userId:string)=>{
  return await revokeAllRefreshTokens(userId);
}