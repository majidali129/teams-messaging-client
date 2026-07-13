import { useState, type ReactElement } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/shared/submit-button";
import { getAvatar, getInitials } from "@/lib/utils";
import type { Chat } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspace-members";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatsApi } from "@/api/services/chats";
import { queryKeys } from "@/query-keys";
import { toast } from "sonner";

interface AddParticipantsToChannelDialogProps {
  chat: Chat;
  trigger: ReactElement;
}

export const AddParticipantsToChannelDialog = ({
  chat,
  trigger,
}: AddParticipantsToChannelDialogProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    [],
  );
  const { user } = useUser();
  const {
    data: { members },
  } = useWorkspaceMembers(chat.workspaceId);
  const { mutate: addParticipants, isPending } = useMutation({
    mutationFn: () => chatsApi.addParticipants(chat.id, selectedParticipants),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.details(chat.chatKey),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.chats.all(chat.workspaceId),
      });

      toast.success(
        `Participant${selectedParticipants.length > 1 ? "s" : ""} added to the channel successfully`,
      );
      setOpen(false);
    },
    onError: () => {
      toast.error(
        `Failed to add participant${selectedParticipants.length > 1 ? "s" : ""} to the channel`,
      );
    },
  });
  const otherMembers = members
    .filter((member) => member.user.id !== user!.id)
    .map((member) => member.user);
  const participants = chat.participants.map((participant) => participant.id);
  const remainingMembers = otherMembers.filter(
    (m) => !participants.includes(m.id),
  );
  const hasMoreMembers = remainingMembers.length > 0;

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    addParticipants();
    setSelectedParticipants([]);
  };

  if (!chat.isChannel || !hasMoreMembers) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add participants to the channel</DialogTitle>
          <DialogDescription>
            Add participants to the channel.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Label>Participants</Label>
            <div className="mt-1.5 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
              {hasMoreMembers ? (
                remainingMembers.map((member) => (
                  <label
                    key={member.id}
                    htmlFor={`participant-${member.id}`}
                    className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-accent"
                  >
                    <Checkbox
                      id={`participant-${member.id}`}
                      name="participants"
                      value={member.id}
                      checked={selectedParticipants.includes(member.id)}
                      onCheckedChange={(checked) =>
                        setSelectedParticipants(
                          checked
                            ? [...selectedParticipants, member.id]
                            : selectedParticipants.filter(
                                (id) => id !== member.id,
                              ),
                        )
                      }
                    />
                    <Avatar size="sm">
                      <AvatarImage
                        src={getAvatar(member.name!)}
                        alt={member.name!}
                      />
                      <AvatarFallback>
                        {getInitials(member.name!)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No remaining members
                </p>
              )}
            </div>
          </div>

          <DialogFooter>
            <SubmitButton
              disabled={!selectedParticipants.length || isPending}
              label="Add participants"
              loading={isPending}
            />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
