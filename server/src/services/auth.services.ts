import UserModel from "../models/user.model";

import AppError from "../utils/AppError";

import {
  hashPassword,
  comparePassword,
} from "../utils/password";

import { issueTokens } from "../utils/issueTokens";

import { buildAuthResponse } from "../utils/authResponse";

import type {
  RegisterUserInput,
  LoginUserInput,
} from "../validators/auth.validator";

export const registerUser = async (
  input: RegisterUserInput
) => {
  const existingUser =
    await UserModel.findOne({
      email: input.email,
    });

  if (existingUser) {
    throw new AppError(
      "User already exists",
      409
    );
  }

  const passwordHash =
    await hashPassword(
      input.password
    );

  try {
    const user =
      await UserModel.create({
        email: input.email,
        passwordHash,
      });

    const {
      accessToken,
      refreshToken,
    } = await issueTokens(user);

    return buildAuthResponse(
      user,
      accessToken,
      refreshToken
    );
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
  const user =
    await UserModel.findOne({
      email: input.email,
    });

  if (!user) {
    throw new AppError(
      "Invalid credentials",
      401
    );
  }

  const passwordValid =
    await comparePassword(
      input.password,
      user.passwordHash
    );

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

  return buildAuthResponse(
    user,
    accessToken,
    refreshToken
  );
};