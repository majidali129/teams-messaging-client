import { Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { signInPath } from "@/paths";

export const ResetPasswordForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>Choose a new password for your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FormError error={undefined} />

          <div>
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              name="newPassword"
              type="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <div>
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              placeholder="Re-enter new password"
              required
              minLength={8}
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <SubmitButton label="Reset password" className="w-full" />
        </form>

        <Link
          to={signInPath()}
          className="mt-6 flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeftIcon className="size-3.5" />
          Back to sign in
        </Link>
      </CardContent>
    </Card>
  );
};
