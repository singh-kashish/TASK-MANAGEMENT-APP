import { apiClient }
  from "../../api/client";

export interface AuthResponse {
  success: boolean;

  data: {
    user: {
      id: string;
      email: string;
    };

    accessToken: string;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
}

export const loginUser =
  async (
    payload: LoginPayload
  ) => {

    const response =
      await apiClient.post<AuthResponse>(
        "/auth/login",
        payload
      );

    return response.data;
  };

export const registerUser =
  async (
    payload: RegisterPayload
  ) => {

    const response =
      await apiClient.post<AuthResponse>(
        "/auth/register",
        payload
      );

    return response.data;
  };