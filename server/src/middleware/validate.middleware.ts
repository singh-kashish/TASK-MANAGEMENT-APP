import {
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";

import { z } from "zod";

import AppError from "../utils/AppError";

type Source =
  | "body"
  | "query"
  | "params";

export default function validate<
  T extends z.ZodType
>(
  schema: T,
  source: Source
): RequestHandler {

  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ) => {

    const parsed =
      schema.safeParse(
        req[source]
      );

    if (!parsed.success) {

      const message =
        parsed.error.issues
          .map(
            issue => issue.message
          )
          .join(", ");

      return next(
        new AppError(
          message,
          400
        )
      );
    }

    req.validated ??= {};

    req.validated[source] =
      parsed.data;

    next();
  };
}