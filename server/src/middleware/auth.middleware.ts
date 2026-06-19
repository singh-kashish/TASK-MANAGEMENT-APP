import {
  Request,
  Response,
  NextFunction,
} from "express";

import AppError from "../utils/AppError";

import {
  jwtPayloadSchema,
} from "../validators/auth.validator";

import {
  verifyAccessToken,
} from "../utils/jwt";

const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      throw new AppError(
        "Authentication required",
        401
      );
    }

    const [scheme, token] =
      authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      throw new AppError(
        "Invalid authorization header",
        401
      );
    }

    const decoded =
      verifyAccessToken(token);

    req.auth =
      jwtPayloadSchema.parse(
        decoded
      );

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError(
            "Invalid or expired token",
            401
          )
    );
  }
};

export default authMiddleware;