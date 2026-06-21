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
  useSearchParams,
} from "react-router-dom";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  useTaskStats,
} from "@/hooks/useTaskStats";

import type {
  TaskStats as TaskStatsType,
} from "../../types/task";
import React from "react";

const EMPTY_STATS: TaskStatsType = {
  total: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  completionRate: 0,
};

function TaskStats() {
  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const activeStatus =
    searchParams.get("status");

  const overdueFilter =
    searchParams.get("overdue");

  const {
    data,
    isLoading,
    isError,
  } = useTaskStats();

  const stats =
    data ?? EMPTY_STATS;

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
      label:
        "Todo",

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

      icon:
        Percent,

      valueClass:
        "text-violet-600 dark:text-violet-400",

      active: false,

      onClick: () => {},
    },
  ];

  if (isLoading) {
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
        {Array.from({
          length: 7,
        }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="space-y-3">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="p-5">
          <p className="text-sm text-red-500">
            Failed to load task
            statistics.
          </p>
        </CardContent>
      </Card>
    );
  }

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
export default React.memo(TaskStats);