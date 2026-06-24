import type { AuthPayload, AuthResponse } from "@/features/auth/auth";
import { apiClient } from "../../api/client";
import type { AppDispatch } from "@/store";
import { bootstrapAuth, authStorage } from "@/utils/authHelper";
import { setCredentials, finishBootstrap, logout } from "./auth.slice";

export const loginUser = async (payload: AuthPayload) => {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  const { user, accessToken } = response.data.data;
  authStorage.setToken(accessToken);
  return { user, accessToken };
};

export const registerUser = async (payload: AuthPayload) => {
  const response = await apiClient.post<AuthResponse>("/auth/register", payload);
  const { user, accessToken } = response.data.data;
  authStorage.setToken(accessToken);
  return { user, accessToken };
};

export const bootstrapAuthFlow = () => async (dispatch: AppDispatch) => {
  try {
    const me = await bootstrapAuth(); 

    if (me) {
      const token = authStorage.getToken();
      if (token) {
        dispatch(setCredentials({ user: me, accessToken: token }));
      } else {
        authStorage.clear();
        dispatch(logout());
      }
    } else {
      authStorage.clear();
      dispatch(logout());
    }
  } finally {
    dispatch(finishBootstrap());
  }
};

export const logoutUser = async(number:"current"|"all")=>{
  if(number==="current")return await apiClient.post("/auth/signout");
  else if(number==="all")return await apiClient.post("auth/signout-all");
  else return;
}
