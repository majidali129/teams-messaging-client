import { useState } from "react";
import { EyeIcon, Loader2Icon, MessageCircleIcon, MoreVerticalIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/shared/role-badge";
import { getAvatar, getInitials } from "@/lib/utils";
import { MemberDetailsDialog } from "./member-details-dialog";
import type { WorkspaceMember } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import { chatsApi } from "@/api/services/chats";
import { toast } from "sonner";

interface MemberListItemProps {
  member: WorkspaceMember;
  canManage: boolean;
  isSelf: boolean;
}

export const MemberListItem = ({ member, isSelf }: MemberListItemProps) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate()
  const {id: workspaceId} = useParams()

  const {mutate: createChat, isPending} = useMutation({
    mutationFn: () => chatsApi.create({
      workspaceId: workspaceId!,
      isChannel: false,
      participants: [member.user.id],
    }),
    onSuccess: (data) => {
      navigate(`/workspaces/${workspaceId}/chats?chat=${data.chatKey}`);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  })


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
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setDetailsOpen(true)}>
            <EyeIcon />
            View details
          </DropdownMenuItem>
          {!isSelf && (
            <DropdownMenuItem disabled={isPending} onClick={() => createChat()}>
              {isPending ? <Loader2Icon className="size-4 animate-spin" /> : <MessageCircleIcon className="size-4" />}
              Message
            </DropdownMenuItem>
          )}
          {/* {canManage && !isSelf && member.role !== WorkspaceRole.owner && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setRemoveOpen(true)}>
                <UserMinusIcon />
                Remove from workspace
              </DropdownMenuItem>
            </>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>

      <MemberDetailsDialog member={member} open={detailsOpen} onOpenChange={setDetailsOpen} />
      {/* <RemoveMemberDialog member={member} open={removeOpen} onOpenChange={setRemoveOpen} /> */}
    </div>
  );
};
