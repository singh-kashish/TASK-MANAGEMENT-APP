import {
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export interface User {
  id: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  const storedUser =
    localStorage.getItem("user");

  const storedToken =
    localStorage.getItem(
      "accessToken"
    );

  return {
    user: storedUser
      ? JSON.parse(storedUser)
      : null,

    accessToken:
      storedToken ?? null,

    isAuthenticated:
      !!storedToken,
  };
};

const initialState =
  getInitialState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        user: User;
        accessToken: string;
      }>
    ) => {
      state.user =
        action.payload.user;

      state.accessToken =
        action.payload.accessToken;

      state.isAuthenticated =
        true;

      localStorage.setItem(
        "user",
        JSON.stringify(
          action.payload.user
        )
      );

      localStorage.setItem(
        "accessToken",
        action.payload.accessToken
      );
    },

    logout: (state) => {
      state.user = null;

      state.accessToken = null;

      state.isAuthenticated =
        false;

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "accessToken"
      );
    },
  },
});

export const {
  loginSuccess,
  logout,
} = authSlice.actions;

export default authSlice.reducer;