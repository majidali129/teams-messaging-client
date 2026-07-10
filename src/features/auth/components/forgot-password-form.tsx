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

export const ForgotPasswordForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter the email associated with your account and we&apos;ll send you a reset code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FormError error={undefined} />

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@company.com"
              required
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <SubmitButton label="Send reset code" className="w-full" />
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
