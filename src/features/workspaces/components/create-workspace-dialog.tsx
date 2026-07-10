import { useState, type ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateWorkspaceForm } from "./create-workspace-form";

export const CreateWorkspaceDialog = ({ trigger }: { trigger: ReactElement }) => {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Give your workspace a name. You can invite teammates right after.
          </DialogDescription>
        </DialogHeader>
        <CreateWorkspaceForm onOpenChange={setOpen} />
      </DialogContent>
    </Dialog>
  );
};
