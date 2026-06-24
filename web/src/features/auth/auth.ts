export interface User {
  id: string;
  email: string;
}
export interface AuthState {
  user: User | null;

  accessToken: string | null;

  isAuthenticated: boolean;

  isBootstrapping: boolean;
}

export interface AuthPayload{
  email: string;
  password: string;
}

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