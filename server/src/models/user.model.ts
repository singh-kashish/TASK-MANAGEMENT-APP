import mongoose, { Schema } from "mongoose";

import { MAX_REFRESH_TOKENS } from "../constants/auth.constants";
import type { IUser } from "../types/user.types";

const refreshTokenSchema = new Schema(
  {
    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    refreshTokens: {
      type: [refreshTokenSchema],
      default: [],
      validate: {
        validator(tokens: unknown[]) {
          return tokens.length <= MAX_REFRESH_TOKENS;
        },
        message: `Maximum ${MAX_REFRESH_TOKENS} active sessions allowed`,
      },
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model<IUser>(
  "User",
  userSchema
);