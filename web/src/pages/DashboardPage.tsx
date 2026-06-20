
import {
  useSearchParams,
} from "react-router-dom";

import CreateTaskDialog
  from "@/components/tasks/CreateTaskDialog";

import TaskFilters
  from "@/components/tasks/TaskFilters";

import TaskList
  from "@/components/tasks/TaskList";

import {
  useTasks,
} from "@/features/tasks/task.hooks";
import TaskStats
  from "@/components/tasks/TaskStats";
import type {
  TaskPriority,
  TaskStatus,
} from "@/features/tasks/task.types";
import type { TaskFiltersInterface } from "@/features/tasks/task.types";

const DashboardPage = () => {

  const [
    searchParams,
  ] =
    useSearchParams();
  const status =
  searchParams.get("status");

const priority =
  searchParams.get("priority");

const filters: TaskFiltersInterface = {
  status:
    status &&
    ["TODO", "IN_PROGRESS", "DONE"].includes(status)
      ? (status as TaskStatus)
      : undefined,

  priority:
    priority &&
    ["LOW", "MEDIUM", "HIGH"].includes(priority)
      ? (priority as TaskPriority)
      : undefined,
};

  const {
    data: tasks,
    isLoading,
    isError,
    error,
  } =
    useTasks(
      filters
    );
    if (isError) {
      return (
        <div
          className="
            rounded-lg
            border
            p-6
          "
        >
          Failed to load tasks - {error.message}
        </div>
      );
    }
  return (
    <main className="container mx-auto max-w-5xl">

      <header className="mb-2 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            Dashboard
          </h1>

          <p className="text-muted-foreground">
            Manage your tasks
          </p>
        </div>

        <CreateTaskDialog />

      </header>
      <TaskStats  />
      <div className="mb-6 mt-2">
        <TaskFilters />
      </div>
      
      <TaskList
        tasks={tasks}
        isLoading={
          isLoading
        }
      />

    </main>
  );
};

export default DashboardPage;