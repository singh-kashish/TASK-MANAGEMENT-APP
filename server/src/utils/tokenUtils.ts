import UserModel from "../models/user.model";
import crypto from "crypto";
import {generateAccessToken,generateRefreshToken} from "./jwt";
import { MAX_REFRESH_TOKENS, REFRESH_TOKEN_TTL } from "../constants/auth.constants";
import { Types } from "mongoose";
import AppError from "./AppError";

const hashRefreshToken = (token: string): string => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const issueTokens = async (
  user: InstanceType<typeof UserModel>
) => {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
  };
  return {
    accessToken:generateAccessToken(payload),
    refreshToken:generateRefreshToken(payload),
  };
};

const storeRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  const tokenHash = hashRefreshToken(refreshToken);
  const now = new Date();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

  return await UserModel.updateOne(
    { _id: userId },
    [
      {
        $set: {
          refreshTokens: {
            $filter: {
              input: "$refreshTokens",
              as: "t",
              cond: { $gt: ["$$t.expiresAt", now] },
            },
          },
        },
      },
      {
        $set: {
          refreshTokens: {
            $slice: ["$refreshTokens", -Math.max(MAX_REFRESH_TOKENS - 1, 0)],
          },
        },
      },
      {
        $set: {
          refreshTokens: {
            $concatArrays: [
              "$refreshTokens",
              [
                {
                  tokenHash,
                  expiresAt,
                },
              ],
            ],
          },
        },
      },
    ],
    { updatePipeline: true } // <-- important
  );
};


const rotateRefreshToken = async (
  oldRefreshTokenHash: string,
  userId: Types.ObjectId | string
) => {
  // Issue new tokens first (pure operation)
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const { accessToken, refreshToken } = await issueTokens(user);

  const newTokenHash = hashRefreshToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

  // Atomically: require old token, drop it, trim, and add new one
  const result = await UserModel.updateOne(
    {
      _id: user._id,
      "refreshTokens.tokenHash": oldRefreshTokenHash,
    },
    [
      // drop the old token and any expired ones (optional but nice)
      {
        $set: {
          refreshTokens: {
            $filter: {
              input: "$refreshTokens",
              as: "t",
              cond: {
                $and: [
                  { $ne: ["$$t.tokenHash", oldRefreshTokenHash] },
                  { $gt: ["$$t.expiresAt", new Date()] },
                ],
              },
            },
          },
        },
      },
      // trim to max-1 to make space
      {
        $set: {
          refreshTokens: {
            $slice: ["$refreshTokens", -Math.max(MAX_REFRESH_TOKENS - 1, 0)],
          },
        },
      },
      // append new token
      {
        $set: {
          refreshTokens: {
            $concatArrays: [
              "$refreshTokens",
              [
                {
                  tokenHash: newTokenHash,
                  expiresAt,
                },
              ],
            ],
          },
        },
      },
    ],
    { updatePipeline: true } 
  );

  if (result.modifiedCount === 0) {
    // old token didn't exist or user changed between findById and update
    throw new AppError("Invalid refresh token", 401);
  }

  return { accessToken, refreshToken };
};

export {issueTokens,hashRefreshToken,storeRefreshToken,rotateRefreshToken}