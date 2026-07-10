import { Badge } from "@/components/ui/badge";
import { InviteStatus } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_LABEL: Record<InviteStatus, string> = {
  [InviteStatus.pending]: "Pending",
  [InviteStatus.accepted]: "Accepted",
  [InviteStatus.declined]: "Declined",
  [InviteStatus.expired]: "Expired",
  [InviteStatus.revoked]: "Revoked",
};

const STATUS_VARIANT: Record<InviteStatus, "default" | "secondary" | "outline" | "destructive"> = {
  [InviteStatus.pending]: "secondary",
  [InviteStatus.accepted]: "default",
  [InviteStatus.declined]: "outline",
  [InviteStatus.expired]: "outline",
  [InviteStatus.revoked]: "destructive",
};

export const InviteStatusBadge = ({ status, className }: { status: InviteStatus; className?: string }) => {
  return (
    <Badge variant={STATUS_VARIANT[status]} className={cn(className)}>
      {STATUS_LABEL[status]}
    </Badge>
  );
};
