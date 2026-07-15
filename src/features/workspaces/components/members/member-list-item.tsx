import { useState } from "react";
import { EyeIcon, Loader2Icon, MessageCircleIcon, MoreVerticalIcon, UserMinusIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/shared/role-badge";
import { getAvatar, getInitials } from "@/lib/utils";
import { MemberDetailsDialog } from "./member-details-dialog";
import { WorkspaceRole, type WorkspaceMember } from "@/types";
import { RemoveMemberDialog } from "./remove-member-dialog";
import { useCreateChat } from "../../hooks/use-create-chat";

interface MemberListItemProps {
  member: WorkspaceMember;
  canManage: boolean;
  isSelf: boolean;
}

export const MemberListItem = ({ member, isSelf, canManage }: MemberListItemProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);

  const {createChat, isPending: isCreatingChat} = useCreateChat(member.user.id);


  const user = member.user;

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <Avatar>
        <AvatarImage src={getAvatar(user.name)} alt={user.name} />
        <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
            {user.name} {isSelf && <span className="text-muted-foreground">(you)</span>}
        </p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>

      <RoleBadge role={member.role} className="hidden sm:inline-flex" />
      <span className="hidden text-xs text-muted-foreground md:inline">
        Joined {new Date(member.joinedAt).toLocaleDateString()}
      </span>

      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <EyeIcon />
            View details
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem disabled={isCreatingChat} onClick={() => createChat()}>
              {isCreatingChat ? <Loader2Icon className="size-4 animate-spin" /> : <MessageCircleIcon className="size-4" />}
              Message
            </DropdownMenuItem>
          )}
          {canManage && !isSelf && member.role !== WorkspaceRole.owner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setRemoveOpen(true)}>
                Remove from workspace
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <MemberDetailsDialog member={member} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <RemoveMemberDialog member={member} open={removeOpen} onOpenChange={setRemoveOpen} />
    </div>
  );
};
