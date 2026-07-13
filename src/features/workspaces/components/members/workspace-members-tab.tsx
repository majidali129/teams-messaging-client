import { useUser } from "@/features/auth/hooks/use-user";
import { PlusIcon } from "lucide-react";
import { MemberListItem } from "./member-list-item";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "../invite-member-dialog";
import { useParams } from "react-router";
import { useWorkspaceMembers } from "../../hooks/use-workspace-members";
import { WorkspaceRole } from "@/types";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";

export const WorkspaceMembersTab = () => {
  const { id } = useParams();
  const {
    data: { members, totalCount },
    isLoading,
    error,
  } = useWorkspaceMembers(id!);
  const { user } = useUser();
  const canManage =
    members.find((m) => m.user.id === user!.id)?.role === WorkspaceRole.owner;

  const renderLoader = () => {
    if (!isLoading) return null;
    return (
      <LoadingState
        title="Loading members"
        description="Please wait while we load the members"
      />
    );
  };

  const renderFallback = () => {
    if (!error) return null;
    return (
      <ErrorState
        title="Failed to load members"
        description="Please try again later"
      />
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {totalCount} member{totalCount > 1 ? "s" : ""}
        </h2>

        {canManage && (
          <InviteMemberDialog
            trigger={
              <Button size="sm" variant="outline" className="">
                <PlusIcon className="size-4" />
                Invite
              </Button>
            }
          />
        )}
      </div>

      {renderLoader()}
      {renderFallback()}
      {totalCount > 0 && !isLoading && !error && (
        <div className="space-y-2">
          {members.map((member) => (
            <MemberListItem
              key={member.user.id}
              member={member}
              canManage={canManage}
              isSelf={member.user.id === user!.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
