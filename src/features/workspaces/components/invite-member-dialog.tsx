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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import { WorkspaceRole } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invitesApi } from "@/api/services/invite";
import { useParams } from "react-router";
import { toast } from "sonner";
import { queryKeys } from "@/query-keys";
import { useWorkspace } from "../hooks/use-workspace";

export const InviteMemberDialog = ({ trigger }: { trigger: ReactElement }) => {
  const queryClient = useQueryClient()  
  const {id: workspaceId} = useParams()
  const {workspace} = useWorkspace();
  const [open, setOpen] = useState(false)
  const [values, setValues] = useState<{email: string, role: WorkspaceRole}>({
    email: '',
    role: WorkspaceRole.member,
  })

  const {mutate: createInvite, isPending} = useMutation({
    mutationFn: () => invitesApi.create(workspaceId as string, {email: values.email, role: values.role, roomKey: workspace!.roomKey}),
    onSuccess: () => {
      toast.success('Invite sent successfully')
      queryClient.invalidateQueries({ queryKey: queryKeys.invites.received() })
      setOpen(false)
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    createInvite()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite a member</DialogTitle>
          <DialogDescription>
            Send an invite by email and choose their role in this workspace.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={onSubmit}>
          <FormError error={undefined} />

          <div>
            <Label htmlFor="invite-email">Email</Label>
            <Input
              id="invite-email"
              name="email"
              type="email"
              placeholder="teammate@company.com"
              required
              className="mt-1.5"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
            <FieldError error={undefined} />
          </div>

          <div>
            <Label htmlFor="invite-role">Role</Label>
            <Select name="role" defaultValue={WorkspaceRole.member.toString()} value={values.role} onValueChange={(value) => setValues({ ...values, role: value as WorkspaceRole })}>
              <SelectTrigger id="invite-role" className="mt-1.5 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={WorkspaceRole.member.toString()}>Member</SelectItem>
                <SelectItem value={WorkspaceRole.guest.toString()}>Guest</SelectItem>
              </SelectContent>
            </Select>
            <FieldError error={undefined} />
          </div>

          <DialogFooter>
            <SubmitButton label="Send invite" loading={isPending} type="submit" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
