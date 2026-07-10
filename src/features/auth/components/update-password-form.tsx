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

export const UpdatePasswordForm = () => {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Update your password</CardTitle>
        <CardDescription>
          Enter your current password and choose a new one.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <FormError error={undefined} />

          <div>
            <Label htmlFor="current-password">Current password</Label>
            <Input
              id="current-password"
              name="currentPassword"
              type="password"
              placeholder="••••••••"
              required
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

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
            <Label htmlFor="confirm-password">Confirm new password</Label>
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

          <SubmitButton label="Update password" className="w-full" />
        </form>
      </CardContent>
    </Card>
  );
};
