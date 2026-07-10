
import { MailIcon, ShieldAlertIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";
import { InviteListItem } from "./invite-list-item";
import { useWorkspace } from "../../hooks/use-workspace";
import { useUser } from "@/features/auth/hooks/use-user";

export const WorkspaceInvitesTab = () => {
  const { workspace } = useWorkspace();
  const {user} = useUser();

  const isOwner = workspace!.owner!.id === user!.id

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

  const invites = workspace!.invites;

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <h2 className="text-sm font-semibold text-muted-foreground">
        {invites!.length} invite{invites!.length === 1 ? "" : "s"} sent
      </h2>

      {invites.length === 0 ? (
        <Empty
          icon={<MailIcon />}
          title="No invites sent yet"
          description="Invite teammates to this workspace to get them collaborating."
        />
      ) : (
        <div className="space-y-2">
          {invites.map((invite) => (
            <InviteListItem key={invite.id} invite={invite} />
          ))}
        </div>
      )}
    </div>
  );
};
