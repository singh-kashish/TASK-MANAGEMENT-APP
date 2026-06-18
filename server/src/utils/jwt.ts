import jwt, {
  SignOptions,
} from "jsonwebtoken";

import { env } from "../config/env";

import type {
  JwtPayload,
} from "../types/auth.types";

export const generateAccessToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
      expiresIn:
        env.JWT_ACCESS_EXPIRES,
    } as SignOptions
  );
};

export const generateRefreshToken = (
  payload: JwtPayload
): string => {
  return jwt.sign(
    payload,
    env.JWT_REFRESH_SECRET,
    {
      expiresIn:
        env.JWT_REFRESH_EXPIRES,
    } as SignOptions
  );
};

export const verifyAccessToken = (
  token: string
): unknown => {
  return jwt.verify(
    token,
    env.JWT_ACCESS_SECRET
  );
};

export const verifyRefreshToken = (
  token: string
): unknown => {
  return jwt.verify(
    token,
    env.JWT_REFRESH_SECRET
  );
};