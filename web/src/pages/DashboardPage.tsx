import {
  useMemo,
} from "react";

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

const DashboardPage = () => {

  const [
    searchParams,
  ] =
    useSearchParams();

  const filters =
    useMemo(
      () => ({
        status:
          searchParams.get(
            "status"
          ) ??
          undefined,

        priority:
          searchParams.get(
            "priority"
          ) ??
          undefined,
      }),
      [searchParams]
    );

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
    <main className="container mx-auto max-w-5xl py-8">

      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

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

      <div className="mb-6">
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