import { UserPlusIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { CURRENT_USER_ID, getMyRoleInWorkspace, getUserById } from "@/lib/mock-data";
import { WorkspaceRole, WorkspaceStatus, type Workspace } from "@/types";
import { InviteMemberDialog } from "./invite-member-dialog";

const STATUS_VARIANT: Record<WorkspaceStatus, "default" | "secondary" | "outline"> = {
  [WorkspaceStatus.active]: "default",
  [WorkspaceStatus.archived]: "secondary",
  [WorkspaceStatus.deleted]: "outline",
};

export const WorkspaceDetailsHeader = ({workspace}: {workspace: Workspace}) => {
  const owner = getUserById(workspace.ownerId);
  const isOwner = getMyRoleInWorkspace(workspace) === WorkspaceRole.owner;

  return (
    <div className="flex flex-wrap items-start justify-between gap-4 border-b p-4 sm:p-6">
      <div className="flex items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight">{workspace.name}</h1>
            <Badge variant={STATUS_VARIANT[workspace.status]} className="capitalize">
              {workspace.status}
            </Badge>
          </div>
          {owner && (
            <p className="mt-1 text-sm text-muted-foreground">
              Owned by {owner.id === CURRENT_USER_ID ? "you" : owner.name}
            </p>
          )}
        </div>
      </div>

      {isOwner && (
        <InviteMemberDialog
          trigger={
            <Button>
              <UserPlusIcon />
              Invite member
            </Button>
          }
        />
      )}
    </div>
  );
};
