import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RoleBadge } from "@/components/shared/role-badge";
import { getInitials } from "@/lib/utils";
import type { WorkspaceMemberWithUser } from "@/types";

export const MemberDetailsDialog = ({
  member,
  open,
  onOpenChange,
}: {
  member: WorkspaceMemberWithUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const user = member.user;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Member details</DialogTitle>
          <DialogDescription>Profile information for this member.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarImage src={user?.avatar?.url} alt={user?.name} />
            <AvatarFallback>{user ? getInitials(user.name) : "?"}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user?.name ?? "Unknown user"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="mt-1">
              <RoleBadge role={member.role} />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Joined</dt>
            <dd className="mt-1">{new Date(member.joinedAt).toLocaleDateString()}</dd>
          </div>
        </dl>
      </DialogContent>
    </Dialog>
  );
};
