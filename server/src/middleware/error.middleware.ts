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

  console.error(err);

  let statusCode = 500;
  let message =
    "Internal Server Error";

  if (
    err instanceof AppError
  ) {

    statusCode =
      err.statusCode;

    message =
      err.message;
  }

  else if (
    err instanceof ZodError
  ) {

    statusCode = 400;

    message =
      err.issues
        .map(
          issue => issue.message
        )
        .join(", ");
  }

  else if (
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    err.code === 11000
  ) {

    statusCode = 409;
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
    message,
  });
};

export default errorMiddleware;