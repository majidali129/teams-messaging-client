import { Link } from "react-router";
import { ArrowLeftIcon, MailCheckIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { signInPath } from "@/paths";

export const VerifyEmailForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheckIcon className="size-5" />
        </div>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          We&apos;ve sent a 6-digit verification code to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FormError error={undefined} />

          <div>
            <Label htmlFor="code">Verification code</Label>
            <Input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              placeholder="000000"
              required
              minLength={6}
              maxLength={6}
              className="mt-1.5 text-center text-lg tracking-[0.5em]"
            />
            <FieldError error={undefined} />
          </div>

          <SubmitButton label="Verify email" className="w-full" />
        </form>

        <div className="mt-6 space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Didn&apos;t receive a code?{" "}
            <Button type="button" variant="link" className="h-auto p-0 text-sm">
              Resend code
            </Button>
          </p>

          <Link
            to={signInPath()}
            className="flex items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            <ArrowLeftIcon className="size-3.5" />
            Back to sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
