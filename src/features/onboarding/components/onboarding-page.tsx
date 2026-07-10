import { useState } from "react";
import { ArrowLeftIcon, MailPlusIcon, PlusIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog";

type OnboardingView = "options" | "accept-invite";

export const OnboardingPage = () => {
  const [view, setView] = useState<OnboardingView>("options");

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8 max-w-md text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome aboard</h1>
        <p className="text-muted-foreground">
          Let&apos;s get you set up — create a new workspace for your team, or join one
          you&apos;ve been invited to.
        </p>
      </div>

      {view === "options" ? (
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          <CreateWorkspaceDialog
            trigger={
              <Card className="cursor-pointer text-left transition-colors hover:bg-muted/50">
                <CardHeader>
                  <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <PlusIcon className="size-5" />
                  </div>
                  <CardTitle>Create a workspace</CardTitle>
                  <CardDescription>
                    Start fresh with a new workspace for your team.
                  </CardDescription>
                </CardHeader>
              </Card>
            }
          />

          <Card
            className="cursor-pointer text-left transition-colors hover:bg-muted/50"
            onClick={() => setView("accept-invite")}
          >
            <CardHeader>
              <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailPlusIcon className="size-5" />
              </div>
              <CardTitle>Accept an invite</CardTitle>
              <CardDescription>
                Join a workspace you&apos;ve already been invited to.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : (
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Accept your invite</CardTitle>
            <CardDescription>
              Paste the invite token from your email to join the workspace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <FormError error={undefined} />
              <div>
                <Label htmlFor="invite-token">Invite token</Label>
                <Input
                  id="invite-token"
                  name="token"
                  type="text"
                  placeholder="Paste your invite token"
                  required
                  className="mt-1.5"
                />
                <FieldError error={undefined} />
              </div>
              <SubmitButton label="Join workspace" className="w-full" />
            </form>

            <Button
              type="button"
              variant="ghost"
              className="mt-4 w-full"
              onClick={() => setView("options")}
            >
              <ArrowLeftIcon />
              Back
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
