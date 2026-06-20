import mongoose from "mongoose";

import UserModel from "../models/user.model";
import { TaskModel } from "../models/task.model";

async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI!
  );

  const user =
    await UserModel.create({
      email:
        "demo@example.com",
      passwordHash:
        "Password123",
    });

  await TaskModel.insertMany([
    {
      title:
        "Setup project",
      status:
        "DONE",
      priority:
        "HIGH",
      user:
        user._id,
    },

    {
      title:
        "Build dashboard",
      status:
        "IN_PROGRESS",
      priority:
        "MEDIUM",
      user:
        user._id,
    },

    {
      title:
        "Create tests",
      status:
        "TODO",
      priority:
        "LOW",
      user:
        user._id,
    },
  ]);

  console.log(
    "Seed completed"
  );

  process.exit(0);
}

seed();