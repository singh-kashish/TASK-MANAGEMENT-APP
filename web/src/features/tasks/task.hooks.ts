import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { toast } from "sonner";

import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "./task.api";

import { taskKeys } from "./task.keys";

import type {
  Task,
  TaskFiltersInterface,
  UpdateTaskPayload,
} from "./task.types";

export const useTasks = (
  filters?: TaskFiltersInterface
) =>
  useQuery({
    queryKey:
      taskKeys.list(filters),

    queryFn: () =>
      getTasks(filters),
  });

export const useCreateTask = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: createTask,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          taskKeys.lists(),
      });

      toast.success(
        "Task created"
      );
    },
  });
};

export const useUpdateTask = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateTaskPayload;
    }) =>
      updateTask(id, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          taskKeys.lists(),
      });

      toast.success(
        "Task updated"
      );
    },
  });
};

export const useDeleteTask = () => {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: deleteTask,

    onMutate: async (
      taskId
    ) => {
      await queryClient.cancelQueries({
        queryKey:
          taskKeys.lists(),
      });

      const previous =
        queryClient.getQueriesData<Task[]>({
          queryKey:
            taskKeys.lists(),
        });

      queryClient.setQueriesData<Task[]>(
        {
          queryKey:
            taskKeys.lists(),
        },
        (old = []) =>
          old.filter(
            (task) =>
              task._id !== taskId
          )
      );

      return { previous };
    },

    onError: (
      _,
      __,
      context
    ) => {
      context?.previous.forEach(
        ([key, value]) => {
          queryClient.setQueryData(
            key,
            value
          );
        }
      );

      toast.error(
        "Delete failed"
      );
    },

    onSuccess: () => {
      toast.success(
        "Task deleted"
      );
    },
  });
};