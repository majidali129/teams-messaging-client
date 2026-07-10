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
import { onboardingPath, signInPath } from "@/paths";
import { useMutation } from "@tanstack/react-query";
import type { SignUpInput, User } from "@/types";
import type { ApiError } from "@/api/client";
import { authApi } from "@/api/services/auth";
import { toast } from "sonner";
import { useState, type ChangeEvent, type FormEvent, type SyntheticEvent } from "react";

export const SignUpForm = () => {
  const navigate = useNavigate()
      const [values,setValues] = useState({
    name: '',
    email: '',
    password: ''
  })
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setValues(prev => ({...prev, [name]: value}))
  }
  const {mutate, isPending} = useMutation<User,ApiError, SignUpInput>({
    mutationFn: authApi.signUp,
    onSuccess: () => {
      toast.success('Account created successfully')
      setTimeout(() => {
        navigate(signInPath())
      }, 2000)
    },
    onError: (err) => {
      toast.error(err.message)
    }
  })

  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(values);
    mutate(values)
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start collaborating with your team in minutes.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={(onSubmit)}>
          <FormError error={undefined} />

          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={values.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
              minLength={3}
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <SubmitButton disabled={isPending} label="Create account" className="w-full" />

          <p className="text-center text-xs text-muted-foreground">
            After signup you&apos;ll go to{" "}
            <Link to={onboardingPath()} className="font-medium text-primary hover:underline">
              onboarding
            </Link>
            .
          </p>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to={signInPath()} className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
