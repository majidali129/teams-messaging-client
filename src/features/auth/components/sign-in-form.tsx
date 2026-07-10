import { Link, useNavigate } from "react-router";
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
import { homePath, signUpPath } from "@/paths";
import { useState, type ChangeEvent, type SyntheticEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import type { ApiError } from "@/api/client";
import type { SignInInput } from "@/types";
import { authApi } from "@/api/services/auth";
import { toast } from "sonner";

export const SignInForm = () => {
  const navigate = useNavigate()
      const [values,setValues] = useState({
    email: '',
    password: ''
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues(prev => ({...prev, [name]: value}))
  }
  const {mutate, isPending} = useMutation<{accessToken: string , refreshToken: string},ApiError, SignInInput>({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      toast.success('Login successfully')
      localStorage.setItem('access-token', data.accessToken)
      localStorage.setItem('refresh-token', data.refreshToken!)
      setTimeout(() => {
        navigate(homePath())
      }, 800)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    mutate(values)
  }
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
              {/* <Link
                to={forgotPasswordPath()}
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link> */}
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
          <Link to={signUpPath()} className="font-medium text-primary hover:underline">
            Create one
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
