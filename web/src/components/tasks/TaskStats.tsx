import { useMemo } from "react";

import {
  CheckCircle2,
  Clock3,
  AlertTriangle,
  ListTodo,
  Activity,
  ClipboardList,
  Percent,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import type { Task } from "@/features/tasks/task.types";

import {
  useSearchParams,
} from "react-router-dom";

interface Props {
  tasks: Task[];
}

export default function TaskStats({
  tasks,
}: Props) {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const activeStatus =
    searchParams.get("status");

  const overdueFilter =
    searchParams.get("overdue");

  const stats = useMemo(() => {
    const now = new Date();

    const total =
      tasks.length;

    const todo =
      tasks.filter(
        task =>
          task.status ===
          "TODO"
      ).length;

    const inProgress =
      tasks.filter(
        task =>
          task.status ===
          "IN_PROGRESS"
      ).length;

    const completed =
      tasks.filter(
        task =>
          task.status ===
          "DONE"
      ).length;

    const pending =
      tasks.filter(
        task =>
          task.status !==
          "DONE"
      ).length;

    const overdue =
      tasks.filter(task => {
        if (!task.dueDate) {
          return false;
        }

        return (
          task.status !==
            "DONE" &&
          new Date(
            task.dueDate
          ) < now
        );
      }).length;

    const completionRate =
      total === 0
        ? 0
        : Math.round(
            (completed /
              total) *
              100
          );

    return {
      total,
      todo,
      inProgress,
      completed,
      pending,
      overdue,
      completionRate,
    };
  }, [tasks]);

  const updateFilter = (
    status?: string,
    overdue?: boolean
  ) => {
    const params =
      new URLSearchParams(
        searchParams
      );

    params.delete(
      "status"
    );

    params.delete(
      "overdue"
    );

    if (status) {
      params.set(
        "status",
        status
      );
    }

    if (overdue) {
      params.set(
        "overdue",
        "true"
      );
    }

    setSearchParams(
      params
    );
  };

  const cards = [
    {
      label:
        "Total Tasks",
      value:
        stats.total,
      icon:
        ClipboardList,
      valueClass:
        "text-foreground",
      active:
        !activeStatus &&
        !overdueFilter,
      onClick: () =>
        updateFilter(),
    },

    {
      label: "Todo",
      value:
        stats.todo,
      icon:
        ListTodo,
      valueClass:
        "text-blue-600 dark:text-blue-400",
      active:
        activeStatus ===
        "TODO",
      onClick: () =>
        updateFilter(
          "TODO"
        ),
    },

    {
      label:
        "In Progress",
      value:
        stats.inProgress,
      icon:
        Activity,
      valueClass:
        "text-amber-600 dark:text-amber-400",
      active:
        activeStatus ===
        "IN_PROGRESS",
      onClick: () =>
        updateFilter(
          "IN_PROGRESS"
        ),
    },

    {
      label:
        "Completed",
      value:
        stats.completed,
      icon:
        CheckCircle2,
      valueClass:
        "text-green-600 dark:text-green-400",
      active:
        activeStatus ===
        "DONE",
      onClick: () =>
        updateFilter(
          "DONE"
        ),
    },

    {
      label:
        "Pending",
      value:
        stats.pending,
      icon:
        Clock3,
      valueClass:
        "text-zinc-600 dark:text-zinc-300",
      active: false,
      onClick: () => {},
    },

    {
      label:
        "Overdue",
      value:
        stats.overdue,
      icon:
        AlertTriangle,
      valueClass:
        "text-red-600 dark:text-red-400",
      active:
        overdueFilter ===
        "true",
      onClick: () =>
        updateFilter(
          undefined,
          true
        ),
    },

    {
      label:
        "Completion Rate",
      value: `${stats.completionRate}%`,
      icon: Percent,
      valueClass:
        "text-violet-600 dark:text-violet-400",
      active: false,
      onClick: () => {},
    },
  ];

  return (
    <section
      aria-label="Task statistics"
      className="
        grid
        gap-4
        sm:grid-cols-2
        xl:grid-cols-4
      "
    >
      {cards.map(
        ({
          label,
          value,
          icon: Icon,
          valueClass,
          active,
          onClick,
        }) => (
          <Card
            key={label}
            onClick={
              onClick
            }
            className={`
              cursor-pointer
              transition-all
              hover:shadow-md
              hover:-translate-y-0.5
              ${
                active
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }
            `}
          >
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  {label}
                </p>

                <p
                  className={`mt-2 text-3xl font-bold ${valueClass}`}
                >
                  {value}
                </p>
              </div>

              <div className="rounded-xl border border-border p-3">
                <Icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        )
      )}
    </section>
  );
}