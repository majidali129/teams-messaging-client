import { Badge } from "@/components/ui/badge";
import { WorkspaceRole } from "@/types";
import { cn } from "@/lib/utils";

const ROLE_LABEL: Record<WorkspaceRole, string> = {
  [WorkspaceRole.owner]: "Owner",
  [WorkspaceRole.member]: "Member",
  [WorkspaceRole.guest]: "Guest",
};

const ROLE_VARIANT: Record<WorkspaceRole, "default" | "secondary" | "outline"> = {
  [WorkspaceRole.owner]: "default",
  [WorkspaceRole.member]: "secondary",
  [WorkspaceRole.guest]: "outline",
};

export function RoleBadge({ role, className }: { role: WorkspaceRole; className?: string }) {
  return (
    <Badge variant={ROLE_VARIANT[role]} className={cn(className)}>
      {ROLE_LABEL[role]}
    </Badge>
  );
}
