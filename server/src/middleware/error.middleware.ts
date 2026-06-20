import {
  Request,
  Response,
  NextFunction,
} from "express";

import { ZodError } from "zod";

import AppError from "../utils/AppError";

const errorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {

  if (
    process.env.NODE_ENV !==
    "test"
  ) {
    console.error(err);
  }

  let statusCode = 500;

  let message =
    "Internal Server Error";

  let code =
    "INTERNAL_ERROR";

  if (
    err instanceof AppError
  ) {
    statusCode =
      err.statusCode;

    message =
      err.message;

    code =
      "APP_ERROR";
  }

  else if (
    err instanceof ZodError
  ) {
    statusCode = 400;

    code =
      "VALIDATION_ERROR";

    message =
      err.issues
        .map(
          issue =>
            issue.message
        )
        .join(", ");
  }

  else if (
    err instanceof Error &&
    err.name ===
      "CastError"
  ) {
    statusCode = 400;

    code =
      "INVALID_ID";

    message =
      "Invalid resource id";
  }

  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {
    statusCode = 409;

    code =
      "DUPLICATE_RESOURCE";

    message =
      "Resource already exists";
  }

  else if (
    err instanceof Error
  ) {
    message =
      err.message;
  }

  res.status(statusCode).json({
    success: false,
    code,
    message,
  });
};

export default errorMiddleware;