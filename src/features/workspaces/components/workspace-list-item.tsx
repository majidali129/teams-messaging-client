import { useState } from "react";
import { Link } from "react-router";
import { EyeIcon, MoreVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RoleBadge } from "@/components/shared/role-badge";
import { getInitials } from "@/lib/utils";
import { workspacePath } from "@/paths";
import { WorkspaceStatus, type Workspace } from "@/types";
import { EditWorkspaceDialog } from "./edit-workspace-dialog";
import { DeleteWorkspaceDialog } from "./delete-workspace-dialog";
import { useUser } from "@/features/auth/hooks/use-user";

const STATUS_VARIANT: Record<WorkspaceStatus, "default" | "secondary" | "outline"> = {
  [WorkspaceStatus.active]: "default",
  [WorkspaceStatus.archived]: "secondary",
  [WorkspaceStatus.deleted]: "outline",
};

export const WorkspaceListItem = ({ workspace }: { workspace: Workspace }) => {
  const { user } = useUser();
  const myRole = workspace.members.find((member) => member.userId === user?.id)?.role;
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
      <Avatar>
        <AvatarFallback>{getInitials(workspace.name)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <Link
          to={workspacePath(workspace.id)}
          className="block truncate text-sm font-medium hover:underline"
        >
          {workspace.name}
        </Link>
        <p className="text-xs text-muted-foreground">
          {workspace.members.length} member{workspace.members.length === 1 ? "" : "s"}
        </p>
      </div>

      <Badge variant={STATUS_VARIANT[workspace.status]} className="hidden capitalize sm:inline-flex">
        {workspace.status}
      </Badge>

      {myRole && <RoleBadge role={myRole} className="hidden sm:inline-flex" />}

      <DropdownMenu>
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
      </DropdownMenu>

      <EditWorkspaceDialog workspace={workspace} open={editOpen} onOpenChange={setEditOpen} />
      <DeleteWorkspaceDialog
        workspace={workspace}
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
      />
    </div>
  );
};
