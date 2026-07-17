import { MailPlusIcon, PlusIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateWorkspaceDialog } from "@/features/workspaces/components/create-workspace-dialog";

export const OnboardingPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-10">
      <div className="mb-8 max-w-md text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Welcome aboard</h1>
        <p className="text-muted-foreground">
          Let&apos;s get you set up — create a new workspace for your team, or join one
          you&apos;ve been invited to.
        </p>
      </div>

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

        <Card className="text-left">
          <CardHeader>
            <div className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MailPlusIcon className="size-5" />
            </div>
            <CardTitle>Accept an invite</CardTitle>
            <CardDescription>
              Open the invitation link from your email, sign in, then choose Accept or Decline on the invite page.
            </CardDescription>
            <p className="text-sm text-muted-foreground">
              If you&apos;re already signed in, pending invites also appear in the notifications bell in the top bar.
            </p>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};
