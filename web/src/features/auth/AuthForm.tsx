import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { useAppDispatch } from "@/hooks/useAppDispatch";
import {  setCredentials } from "@/features/auth/auth.slice";
import { useLogin, useRegister } from "@/features/auth/auth.hooks";

import {Card,CardContent,CardHeader,CardTitle} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Button } from "../../components/ui/button";

interface Props {
  mode: "login" | "register";
}

const baseSchema = z.object({
  email: z.email("Invalid email").trim().toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required") 
    .max(72, "Password is too long"),
  confirmPassword: z.string().optional(),
});

const registerSchema = baseSchema
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password is too long"),
    confirmPassword: z
      .string()
      .min(8, "Confirm your password"),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

const loginSchema = baseSchema; 


export default function AuthForm({ mode }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isRegister = mode === "register";

const schema = useMemo(
  () => (isRegister ? registerSchema : loginSchema),
  [isRegister]
);

type FormData = z.infer<typeof schema>;


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loginMutation = useLogin();
  const registerMutation = useRegister();

  const isLoading =
    loginMutation.isPending || registerMutation.isPending;

  const onSubmit = async (values: FormData) => {
    try {
      const payload = {
        email: values.email,
        password: values.password,
      };

      const {user,accessToken} = isRegister
        ? await registerMutation.mutateAsync(payload)
        : await loginMutation.mutateAsync(payload);

      dispatch(
        setCredentials({
          user,
          accessToken
        })
      );

      toast.success(
        isRegister
          ? "Account created successfully"
          : "Logged in successfully"
      );
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      const message =
        error?.response?.data?.message ??
        "Something went wrong";

      toast.error(message);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {isRegister ? "Create Account" : "Welcome Back"}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-red-500">
                {errors.password.message}
              </p>
            )}
          </div>

          {isRegister && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full cursor-pointer border border-blue-600 text-blue-600
    bg-white dark:bg-black
    hover:bg-blue-50 dark:hover:bg-blue-900/20"
            disabled={isLoading}
          >
            {isLoading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
