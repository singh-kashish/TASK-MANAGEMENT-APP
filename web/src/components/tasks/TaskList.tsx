import TaskCard
  from "./TaskCard";

import {
  Skeleton,
} from "@/components/ui/skeleton";

import type {
  Task,
} from "@/features/tasks/task.types";
import React from "react";

interface Props {
  tasks?: Task[];

  isLoading: boolean;
}

const TaskList = ({
  tasks,
  isLoading,
}: Props) => {

  if (isLoading) {
    return (
      <div className="grid gap-4">

        {Array.from({
          length: 5,
        }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-32"
          />
        ))}

      </div>
    );
  }

  if (
    !tasks ||
    tasks.length === 0
  ) {
    return (
      <section
        className="rounded-lg border p-12 text-center"
      >
        <h3 className="text-lg font-semibold">
          No Tasks Found
        </h3>

        <p className="mt-2 text-muted-foreground">
          Create your first
          task to get started.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Tasks"
      className="grid gap-4"
    >
      {tasks.map(
        (task) => (
          <TaskCard
            key={task._id}
            task={task}
          />
        )
      )}
    </section>
  );
};

export default React.memo(TaskList);