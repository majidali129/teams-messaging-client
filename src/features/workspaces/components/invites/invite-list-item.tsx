import { RoleBadge } from "@/components/shared/role-badge";
import { type Invite } from "@/types";
import { InviteStatusBadge } from "./invite-status-badge";

export const InviteListItem = ({ invite }: { invite: Invite }) => {
  const inviter = invite.invitedBy;
  // const isPending = invite.status === InviteStatus.pending;

  return (
    <div className="flex flex-col gap-3 rounded-lg border bg-card p-3 sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{invite.email}</p>
        <p className="text-xs text-muted-foreground">
          Invited by {inviter.name} · expires{" "}
          {new Date(invite.expiresAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <RoleBadge role={invite.role} />
        <InviteStatusBadge status={invite.status} />
      </div>

      {/* <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!isPending}>
          Resend
        </Button>
        <Button variant="outline" size="sm" disabled={!isPending}>
          Revoke
        </Button>
      </div> */}
    </div>
  );
};
