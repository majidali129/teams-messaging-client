import type { ReactElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { getAvatar, getInitials } from "@/lib/utils";
import type { Workspace } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";

interface CreateChatDialogProps {
  workspace: Workspace;
  trigger: ReactElement;
}

export const CreateChatDialog = ({ workspace, trigger }: CreateChatDialogProps) => {
  const { user } = useUser();
  const otherMembers = workspace.members
    .filter((member) => member.userId !== user!.id)
    .map((member) => member.user)
    .filter((user): user is NonNullable<typeof user> => Boolean(user));

  return (
    <Dialog>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group chat</DialogTitle>
          <DialogDescription>
            Name your group and add participants now, or skip and add them later.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4">
          <FormError error={undefined} />

          <div>
            <Label htmlFor="chat-name">Group name</Label>
            <Input
              id="chat-name"
              name="name"
              type="text"
              placeholder="e.g. release-planning"
              required
              minLength={2}
              className="mt-1.5"
            />
            <FieldError error={undefined} />
          </div>

          <div>
            <Label>Participants</Label>
            <div className="mt-1.5 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
              {otherMembers.map((user) => (
                <label
                  key={user.id}
                  htmlFor={`participant-${user.id}`}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-accent"
                >
                  <Checkbox id={`participant-${user.id}`} name="participants" value={user.id} />
                  <Avatar size="sm">
                    <AvatarImage src={getAvatar(user.name!)} alt={user.name!} />
                    <AvatarFallback>{getInitials(user.name!)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{user.name}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              You can also skip this and add participants later.
            </p>
          </div>

          <DialogFooter>
            <SubmitButton label="Create group" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
