import { useUser } from "@/features/auth/hooks/use-user";
import { PlusIcon, UsersIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";
import { MemberListItem } from "./member-list-item";
import { useWorkspace } from "../../hooks/use-workspace";
import { Button } from "@/components/ui/button";
import { InviteMemberDialog } from "../invite-member-dialog";

export const WorkspaceMembersTab = () => {
  const { workspace } = useWorkspace();
  const {user} = useUser();
  const canManage = workspace.owner.id === user.id

  return (
    <div className="mx-auto max-w-3xl space-y-4 p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          {workspace.members.length} member{workspace.members.length === 1 ? "" : "s"}
        </h2>

        {canManage && (
          <InviteMemberDialog trigger={
          <Button size="sm" variant="outline" className="">
            <PlusIcon className="size-4" />
            Invite
          </Button>
          } />
        )}
      </div>

      {workspace.members.length === 0 ? (
        <Empty icon={<UsersIcon />} title="No members yet" description="Invite teammates to get started." />
      ) : (
        <div className="space-y-2">
          {workspace.members.map((member) => (
            <MemberListItem
              key={member.userId}
              member={member}
              canManage={canManage}
              isSelf={member.userId === user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
