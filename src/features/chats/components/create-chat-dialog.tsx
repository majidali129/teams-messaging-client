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
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { getAvatar, getInitials } from "@/lib/utils";
import type { Workspace } from "@/types";
import { useUser } from "@/features/auth/hooks/use-user";
import { useWorkspaceMembers } from "@/features/workspaces/hooks/use-workspace-members";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { chatsApi } from "@/api/services/chats";
import { toast } from "sonner";
import { queryKeys } from "@/query-keys";
import { useNavigate } from "react-router";

interface CreateChatDialogProps {
  workspace: Workspace;
  trigger: ReactElement;
}

export const CreateChatDialog = ({ workspace, trigger }: CreateChatDialogProps) => {
  const { user } = useUser();
  const {data: {members}} = useWorkspaceMembers(workspace.id)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [chatName, setChatName] = useState('')
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([])

  const {mutate: createChat, isPending} = useMutation({
    mutationFn: () => chatsApi.create({name: chatName, isChannel: true, workspaceId: workspace.id, participants: selectedParticipants}),
    onSuccess: (chat) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(workspace.id) })
      toast.success('Chat created successfully')
      navigate(`/workspaces/${workspace.id}/chats?chat=${chat.chatKey}`)
      setOpen(false)
    },
    onError: () => {
      toast.error('Failed to create chat')
    }
  })

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    createChat()
    setChatName('')
    setSelectedParticipants([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a group chat</DialogTitle>
          <DialogDescription>
            Name your group and add participants now, or skip and add them later.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
            />
            <FieldError error={undefined} />
          </div>

          <div>
            <Label>Participants</Label>
            <div className="mt-1.5 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
              {members.filter(m => m.user.id !== user?.id).map((member) => (
                <label
                  key={member.user.id}
                  htmlFor={`participant-${member.user.id}`}
                  className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 hover:bg-accent"
                >
                  <Checkbox id={`participant-${member.user.id}`} name="participants" value={member.user.id} checked={selectedParticipants.includes(member.user.id)} onCheckedChange={(checked) => setSelectedParticipants(checked ? [...selectedParticipants, member.user.id] : selectedParticipants.filter(id => id !== member.user.id))} />
                  <Avatar size="sm">
                    <AvatarImage src={getAvatar(member.user.name!)} alt={member.user.name!} />
                    <AvatarFallback>{getInitials(member.user.name!)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{member.user.name}</span>
                </label>
              ))}
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              You can also skip this and add participants later.
            </p>
          </div>

          <DialogFooter>
            <SubmitButton label="Create group" loading={isPending} disabled={!selectedParticipants.length || isPending} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
