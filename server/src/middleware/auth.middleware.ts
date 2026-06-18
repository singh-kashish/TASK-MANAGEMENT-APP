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
      return next(
        new AppError(
          "Authentication required",
          401
        )
      );
    }

    const [scheme, token] =
      authHeader.split(" ");

    if (
      scheme !== "Bearer" ||
      !token
    ) {
      return next(
        new AppError(
          "Invalid authorization header",
          401
        )
      );
    }

    const decoded =
      verifyAccessToken(
        token
      );

    const payload =
      jwtPayloadSchema.parse(
        decoded
      );

    req.auth = payload;

    next();

  } catch {

    next(
      new AppError(
        "Invalid or expired token",
        401
      )
    );
  }
};

export default authMiddleware;