import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UpdateWorkspaceForm } from "./update-workspace-form";
import type { Workspace } from "@/types";

export const EditWorkspaceDialog = ({
  workspace,
  open,
  onOpenChange,
}: {
  workspace: Workspace;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit workspace</DialogTitle>
          <DialogDescription>Update your workspace name.</DialogDescription>
        </DialogHeader>
        <UpdateWorkspaceForm workspace={workspace} />
      </DialogContent>
    </Dialog>
  );
};
