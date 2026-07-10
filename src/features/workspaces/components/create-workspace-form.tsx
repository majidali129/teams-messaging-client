import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateWorkspaceInput } from "@/types";
import type { ApiError } from "@/api/client";
import { workspaceApi} from "@/api/services/workspace";
import { toast } from "sonner";
import { useState, type SyntheticEvent } from "react";
import { queryKeys } from "@/query-keys";
import type { Workspace } from "@/types";

export const CreateWorkspaceForm = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {  
  const queryClient = useQueryClient()
  const [name, setName] = useState('')

const {mutate, isPending} = useMutation<Workspace,ApiError, CreateWorkspaceInput>({
mutationFn: workspaceApi.create,
onSuccess: () => {
  toast.success('Workspace created successfully')
  queryClient.invalidateQueries({queryKey: queryKeys.workspaces.all})
  onOpenChange(false)
},
onError: (err) => {
  toast.error(err.message)
}
})

const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
e.preventDefault()
mutate({name})
}
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <FormError error={undefined} />
      <div>
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input
          id="workspace-name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.trim())}
          placeholder="Acme Inc."
          required
          minLength={3}
          className="mt-1.5"
        />
        <FieldError error={undefined} />
      </div>
      <DialogFooter>
        <SubmitButton disabled={isPending} label="Create workspace" loading={isPending} />
      </DialogFooter>
    </form>
  );
};
