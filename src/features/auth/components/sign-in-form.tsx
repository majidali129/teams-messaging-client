import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { homePath, signUpPath, signUpWithReturnPath } from "@/paths";
import { useState, type ChangeEvent, type SyntheticEvent, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ApiError } from "@/api/client";
import type { SignInInput, SignInResponse } from "@/types";
import { authApi } from "@/api/services/auth";
import { toast } from "sonner";
import { queryKeys } from "@/query-keys";
import { getSafeReturnTo } from "@/lib/safe-return-to";

export const SignInForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = getSafeReturnTo(searchParams.get("returnTo"));
  const prefilledEmail = searchParams.get("email") ?? "";

  const [values, setValues] = useState({
    email: prefilledEmail,
    password: "",
  });

  const signUpHref = useMemo(() => {
    if (returnTo) return signUpWithReturnPath(returnTo, prefilledEmail || values.email);
    return signUpPath();
  }, [returnTo, prefilledEmail, values.email]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<SignInResponse, ApiError, SignInInput>({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      toast.success("Login successfully");
      localStorage.setItem("access-token", data.accessToken);
      localStorage.setItem("refresh-token", data.refreshToken);
      localStorage.setItem("user", JSON.stringify(data.user));
      queryClient.setQueryData(queryKeys.users.current, data.user);
      navigate(returnTo ?? homePath(), { replace: true });
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(values);
  };
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to continue to your workspaces.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormError error={undefined} />

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <SubmitButton disabled={isPending} label="Sign in" className="w-full" />
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link to={signUpHref} className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
