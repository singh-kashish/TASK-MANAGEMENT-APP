import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import healthRoutes from "./routes/health.routes";
import { env } from "./config/env";
import authRoutes from './routes/auth.routes'
import errorMiddleware from "./middleware/error.middleware";
import taskRoutes from "./routes/task.routes";
import notFound from "./middleware/notFound";
import { globalLimiter } from "./middleware/rateLimit.middleware";

const app = express();

app.use(globalLimiter);

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
app.use("/api/auth",authRoutes);
app.use("/api/tasks",taskRoutes)

app.use(notFound);
app.use(errorMiddleware);

export default app;