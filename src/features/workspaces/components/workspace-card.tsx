import { useState } from "react";
import { Link } from "react-router";
import { UsersIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { RoleBadge } from "@/components/shared/role-badge";
import { getInitials } from "@/lib/utils";
import { workspacePath } from "@/paths";
import { WorkspaceStatus, type Workspace } from "@/types";
import { EditWorkspaceDialog } from "./edit-workspace-dialog";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import { useUser } from "@/features/auth/hooks/use-user";
import { useWorkspaceMembers } from "../hooks/use-workspace-members";

const STATUS_VARIANT: Record<
  WorkspaceStatus,
  "default" | "secondary" | "outline"
> = {
  [WorkspaceStatus.active]: "default",
  [WorkspaceStatus.archived]: "secondary",
  [WorkspaceStatus.deleted]: "outline",
};

export const WorkspaceCard = ({ workspace }: { workspace: Workspace }) => {
  const { user } = useUser();
  const {
    data: { members, totalCount },
  } = useWorkspaceMembers(workspace.id);
  const myRole = members.find((m) => m.user.id === user!.id)?.role;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-start gap-3">
        <Avatar size="lg">
          <AvatarFallback>{getInitials(workspace?.name)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <Link
            to={workspacePath(workspace.id)}
            className="block truncate font-heading text-base font-medium hover:underline"
          >
            {workspace.name}
          </Link>
          <Badge
            variant={STATUS_VARIANT[workspace.status]}
            className="mt-1 capitalize"
          >
            {workspace.status}
          </Badge>
        </div>
        {/* <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
            <MoreVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link to={workspacePath(workspace.id)} />}>
              <EyeIcon />
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditOpen(true)}>
              <PencilIcon />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
              <Trash2Icon />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu> */}
      </CardHeader>
      <CardContent className="flex items-center gap-2 text-sm text-muted-foreground">
        <UsersIcon className="size-4" />
        {totalCount} member{totalCount > 1 ? "s" : ""}
      </CardContent>
      {myRole && (
        <CardFooter>
          <span className="text-xs text-muted-foreground">Your role</span>
          <RoleBadge role={myRole} className="ml-auto" />
        </CardFooter>
      )}

      <EditWorkspaceDialog
        workspace={workspace}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <DeleteWorkspaceDialog
        workspace={workspace}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </Card>
  );
};
