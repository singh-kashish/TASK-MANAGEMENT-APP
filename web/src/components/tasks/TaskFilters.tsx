import {
  useSearchParams,
} from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

const TaskFilters = () => {

  const [
    searchParams,
    setSearchParams,
  ] =
    useSearchParams();

  const updateFilter =
    (
      key: string,
      value: string
    ) => {

      const params =
        new URLSearchParams(
          searchParams
        );

      if (
        value === "ALL"
      ) {
        params.delete(key);
      } else {
        params.set(
          key,
          value
        );
      }

      setSearchParams(
        params
      );
    };

  return (
    <section
      aria-label="Task Filters"
      className="flex flex-wrap gap-4"
    >

      <Select
        value={
          searchParams.get(
            "status"
          ) ??
          "ALL"
        }
        onValueChange={(
          value
        ) =>
          updateFilter(
            "status",
            value
          )
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            All Statuses
          </SelectItem>

          <SelectItem value="TODO">
            Todo
          </SelectItem>

          <SelectItem value="IN_PROGRESS">
            In Progress
          </SelectItem>

          <SelectItem value="DONE">
            Done
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={
          searchParams.get(
            "priority"
          ) ??
          "ALL"
        }
        onValueChange={(
          value
        ) =>
          updateFilter(
            "priority",
            value
          )
        }
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">
            All Priorities
          </SelectItem>

          <SelectItem value="LOW">
            Low
          </SelectItem>

          <SelectItem value="MEDIUM">
            Medium
          </SelectItem>

          <SelectItem value="HIGH">
            High
          </SelectItem>
        </SelectContent>
      </Select>

      <Select
      value={
        searchParams.get(
          "sortBy"
        ) ?? "createdAt"
      }
      ></Select>

    </section>
  );
};

export default React.memo(TaskFilters);