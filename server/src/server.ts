import app from './app';
import { env } from './config/env';
import { connectDB } from "./config/db";

const PORT = env.PORT;

async function bootstrap() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
}

bootstrap();