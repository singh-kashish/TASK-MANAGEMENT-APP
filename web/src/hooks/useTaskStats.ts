import { useQuery }
  from "@tanstack/react-query";

import {
  getTaskStats,
} from "../features/tasks/task.api";

export const useTaskStats =
  () =>
    useQuery({
      queryKey:
        ["task-stats"],

      queryFn:
        getTaskStats,
});