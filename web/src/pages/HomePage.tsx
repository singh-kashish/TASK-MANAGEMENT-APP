import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold">
        TaskFlow - Task Management Platform
      </h1>

      <p className="text-muted-foreground">
        Manage tasks efficiently.
      </p>

      <div className="flex gap-4">
        <Link
          to="/login"
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="px-4 py-2 rounded-md border"
        >
          Register
        </Link>
      </div>
    </main>
  );
}