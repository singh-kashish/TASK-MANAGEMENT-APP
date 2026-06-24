import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthState, User } from "@/features/auth/auth";
import { authStorage } from "@/utils/authHelper";

const getInitialState = (): AuthState => {
  const token = authStorage.getToken();
  return {
    user: null,
    accessToken: token ?? null,
    isAuthenticated: !!token,
    isBootstrapping: true,
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
    finishBootstrap(state) {
      state.isBootstrapping = false;
    },
  },
});

export const { setCredentials, setAccessToken, logout, finishBootstrap } = authSlice.actions;
export default authSlice.reducer;
