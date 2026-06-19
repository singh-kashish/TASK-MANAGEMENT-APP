import UserModel from "../models/user.model";

import {
  generateAccessToken,
  generateRefreshToken,
} from "./jwt";

import { hashRefreshToken } from "./tokenHash";

import { MAX_REFRESH_TOKENS } from "../constants/auth.constants";

const REFRESH_TOKEN_TTL =
  7 * 24 * 60 * 60 * 1000;

export const issueTokens = async (
  user: InstanceType<typeof UserModel>
) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
  };

  const accessToken =
    generateAccessToken(payload);

  const refreshToken =
    generateRefreshToken(payload);

  const tokenHash =
    hashRefreshToken(refreshToken);

  user.refreshTokens =
    user.refreshTokens.filter(
      (token) =>
        token.expiresAt > new Date()
    );

  if (
    user.refreshTokens.length >=
    MAX_REFRESH_TOKENS
  ) {
    user.refreshTokens.shift();
  }

  user.refreshTokens.push({
    tokenHash,
    expiresAt: new Date(
      Date.now() +
      REFRESH_TOKEN_TTL
    ),
  });

  await user.save();

  return {
    accessToken,
    refreshToken,
  };
};