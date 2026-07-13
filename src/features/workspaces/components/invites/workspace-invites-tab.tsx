
import { MailIcon, ShieldAlertIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";
import { InviteListItem } from "./invite-list-item";
import { useWorkspace } from "../../hooks/use-workspace";
import { useUser } from "@/features/auth/hooks/use-user";
import { useWorkspaceInvites } from "../../hooks/use-workspace-invites";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useParams } from "react-router";

export const WorkspaceInvitesTab = () => {
  const { id } = useParams();
  const {workspace} = useWorkspace()
  const {data: {invites, totalCount}, isLoading, error} = useWorkspaceInvites(id!)

  const {user} = useUser();

  const isOwner = workspace!.owner.id === user!.id

  if (!isOwner) {
    return (
      <div className="flex h-full items-center justify-center">
        <Empty
          icon={<ShieldAlertIcon />}
          title="Owner-only section"
          description="Only the workspace owner can view invites sent for this workspace. Invites addressed to you appear in the notifications bell in the top bar."
        />
      </div>
    );
  }

  const renderLoader = () => {
    if(!isLoading) return null
    return <LoadingState title="Loading invites" description="Please wait while we load the invites" />
  }

  const renderFallback = () => {
    if(!error) return null
    return <ErrorState title="Failed to load invites" description="Please try again later" />
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        {totalCount} invite{totalCount > 1 ? "s" : "t"} sent
      </h2>

      {renderLoader()}
      {renderFallback()}
      {totalCount > 0 && !isLoading && !error && (
        <div className="space-y-2">
          {invites.map((invite) => (
            <InviteListItem key={invite.id} invite={invite} />
          ))}
        </div>
      )}
      {totalCount === 0 && !isLoading && !error && (
        <Empty
          icon={<MailIcon />}
          title="No invites sent yet"
          description="Invite teammates to this workspace to get them collaborating."
        />
      )}
    </div>
  );
};
