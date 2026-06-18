import type { JwtPayload } from "./types/auth.types";

export {};

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;

      requestId?: string;

      validated?: {
        body?: unknown;
        query?: unknown;
        params?: unknown;
      };
    }
  }
}