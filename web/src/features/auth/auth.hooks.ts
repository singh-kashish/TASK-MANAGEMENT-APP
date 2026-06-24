import { useMutation } from "@tanstack/react-query";
import {loginUser,registerUser} from "./auth.api";
import type { AuthPayload } from "@/features/auth/auth";
import { authStorage } from "@/utils/authHelper";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "./auth.slice";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "./auth.api";
import { useCallback } from "react";

export const useLogin = () =>
  useMutation({
    mutationFn: (payload: AuthPayload) => loginUser(payload),
});

export const useRegister = () =>
  useMutation({
    mutationFn: (payload: AuthPayload) => registerUser(payload),
});

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(
    async (scope: "current" | "all") => {
      await logoutUser(scope);
      authStorage.clear();
      dispatch(logout());
      navigate("/", { replace: true });
    },
    [dispatch, navigate]
  );

  return handleLogout;
};
