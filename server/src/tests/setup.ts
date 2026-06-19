import mongoose from "mongoose";
import { connectDB } from "../config/db";

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.close();
});