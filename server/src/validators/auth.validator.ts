import { z } from "zod";

export const registerUserSchema = z.object({
  email: z.email().trim().toLowerCase(),

  password: z.string().min(8, "Password must be at least 8 characters").max(72, "Password is too long"),
});

export const loginUserSchema = z.object({
  email: z.email().trim().toLowerCase(),

  password: z.string().min(1, "Password is required"),
});
// Regex below verifies mongodb's object-id schema(24 characters & hexadecimals)
export const jwtPayloadSchema = z.object({
  userId: z.string()
    .regex(
      /^[0-9a-fA-F]{24}$/,
      "Invalid user id"
    ),

  email: z.email().trim().toLowerCase(),
});

export type RegisterUserInput =
  z.infer<typeof registerUserSchema>;

export type LoginUserInput =
  z.infer<typeof loginUserSchema>;

export type JwtPayload =
  z.infer<typeof jwtPayloadSchema>;