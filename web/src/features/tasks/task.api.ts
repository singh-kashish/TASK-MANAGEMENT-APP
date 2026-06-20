import { apiClient } from "@/api/client";

import type {
  Task,
  TaskFilters,
  CreateTaskPayload,
  UpdateTaskPayload,
} from "./task.types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const getTasks = async (
  filters?: TaskFilters
): Promise<Task[]> => {
  const response =
    await apiClient.get<ApiResponse<Task[]>>(
      "/tasks",
      {
        params: filters,
      }
    );

  return response.data.data;
};

export const createTask = async (
  payload: CreateTaskPayload
): Promise<Task> => {
  const response =
    await apiClient.post<ApiResponse<Task>>(
      "/tasks",
      payload
    );

  return response.data.data;
};

export const updateTask = async (
  id: string,
  payload: UpdateTaskPayload
): Promise<Task> => {
  const response =
    await apiClient.patch<ApiResponse<Task>>(
      `/tasks/${id}`,
      payload
    );

  return response.data.data;
};

export const deleteTask = async (
  id: string
): Promise<void> => {
  await apiClient.delete(
    `/tasks/${id}`
  );
};