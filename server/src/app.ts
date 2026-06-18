import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import { env } from "./config/env";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use("/api/health", healthRoutes);

export default app;