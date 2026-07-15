import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { WorkspaceMember } from "@/types";
import { useRemoveMember } from "../../hooks/use-remove-member";
import { Loader2Icon, UserMinusIcon } from "lucide-react";

export const RemoveMemberDialog = ({
  member,
  open,
  onOpenChange,
}: {
  member: WorkspaceMember;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { removeMember, isPending: isRemovingMember } = useRemoveMember();
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {member.user.name}?</AlertDialogTitle>
          <AlertDialogDescription>
            They will lose access to this workspace, its chats, and shared content
            immediately.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive"
            onClick={() => removeMember(member.user.id)}
            disabled={isRemovingMember}>
            {isRemovingMember ? <Loader2Icon className="size-4 animate-spin" /> : <UserMinusIcon />}
            Remove member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
