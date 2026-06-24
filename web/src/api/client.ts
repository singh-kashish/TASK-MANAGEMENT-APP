// src/api/client.ts
import axios, { AxiosError } from "axios";
import { authStorage, refreshAccessToken } from "@/utils/authHelper";
import { store } from "@/store";
import { setAccessToken, logout } from "@/features/auth/auth.slice";

export const apiClient = axios.create({baseURL: import.meta.env.VITE_API_URL,withCredentials: true,
  headers: {"Content-Type": "application/json",},});

apiClient.interceptors.request.use((config) => {
  const token = authStorage.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: ((token: string | null) => void)[] = [];

const processQueue = (token: string | null) => {
  pendingRequests.forEach((cb) => cb(token));
  pendingRequests = [];
};

apiClient.interceptors.response.use((response) => response, async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;
    const url = originalRequest?.url as string | undefined;
    const isRefreshCall = url?.includes("/auth/refresh");

    if (status === 401 && !originalRequest._retry && !isRefreshCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push((newToken) => {
            if (!newToken) {
              reject(error);
              return;
            }
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();
        store.dispatch(setAccessToken(newToken));
        processQueue(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (e) {
        processQueue(null);
        authStorage.clear();
        store.dispatch(logout());
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
