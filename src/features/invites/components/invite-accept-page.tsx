import { LoaderCircle } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/shared/role-badge";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { useInvitePreview } from "../hooks/use-invite-preview";
import { useResponseToInvite } from "@/features/workspaces/hooks/use-response-to-invite";
import { inviteAcceptPath, signInWithReturnPath, signUpWithReturnPath } from "@/paths";
import { isAuthenticated } from "@/lib/safe-return-to";

export const InviteAcceptPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const inviteId = searchParams.get("inviteId");
  const returnTo =
    token && inviteId ? inviteAcceptPath(token, inviteId) : null;

  const { data: preview, isLoading, error } = useInvitePreview(token, inviteId);
  const { respondToInvite, isPending } = useResponseToInvite({
    redirectOnAccept: true,
    redirectOnDecline: true,
  });

  const authed = isAuthenticated();

  if (!token || !inviteId) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title="Invalid invite link"
          description="This invitation link is missing required information. Ask your teammate to send a new invite."
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <LoadingState title="Loading invitation" description="Please wait while we verify your invite." />
      </div>
    );
  }

  if (error || !preview) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <ErrorState
          title="Invite unavailable"
          description="This invitation is invalid, expired, or has already been used."
        />
      </div>
    );
  }

  const handleRespond = (status: "accepted" | "declined") => {
    if (!authed) {
      const authPath =
        status === "accepted"
          ? signInWithReturnPath(returnTo!, preview.email)
          : signInWithReturnPath(returnTo!, preview.email);
      navigate(authPath);
      return;
    }

    respondToInvite({
      inviteId: preview.inviteId,
      input: {
        token,
        workspaceId: preview.workspace.id,
        status,
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>You&apos;re invited</CardTitle>
          <CardDescription>
            {preview.invitedBy.name} invited you to join{" "}
            <span className="font-medium text-foreground">{preview.workspace.name}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">{preview.workspace.name}</p>
                <p className="text-muted-foreground">{preview.email}</p>
              </div>
              <RoleBadge role={preview.role} />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Expires {new Date(preview.expiresAt).toLocaleString()}
            </p>
          </div>

          {!authed && (
            <p className="text-sm text-muted-foreground">
              Sign in or create an account with <span className="font-medium">{preview.email}</span> to respond to this invite.
            </p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <div className="flex w-full gap-2">
            <Button
              className="flex-1"
              disabled={isPending}
              onClick={() => handleRespond("accepted")}
            >
              {isPending ? <LoaderCircle className="size-4 animate-spin" /> : "Accept"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              disabled={isPending}
              onClick={() => handleRespond("declined")}
            >
              Decline
            </Button>
          </div>

          {!authed && (
            <p className="text-center text-sm text-muted-foreground">
              New here?{" "}
              <Link
                to={signUpWithReturnPath(returnTo!, preview.email)}
                className="font-medium text-primary hover:underline"
              >
                Create an account
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};
