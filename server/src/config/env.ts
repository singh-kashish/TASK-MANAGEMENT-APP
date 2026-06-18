import dotenv from "dotenv";

dotenv.config();

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.url().min(1),
  CLIENT_URL: z.url().default("http://localhost:5173"),
  JWT_ACCESS_SECRET:z.string().min(30),
  JWT_REFRESH_SECRET:z.string().min(30),
  JWT_ACCESS_EXPIRES:z.string(),
  JWT_REFRESH_EXPIRES:z.string()
});

const parsedEnv =
  envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:"
  );
  const errorTree = z.treeifyError(parsedEnv.error);
  console.error(
    parsedEnv.error.flatten().fieldErrors,
    errorTree.properties
  );

  process.exit(1);
}

export const env = parsedEnv.data;