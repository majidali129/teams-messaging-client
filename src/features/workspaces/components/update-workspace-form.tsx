import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { SubmitButton } from "@/components/shared/submit-button";
import { FormError } from "@/components/shared/form-error";
import { FieldError } from "@/components/shared/field-error";
import type { Workspace } from "@/types";

export const UpdateWorkspaceForm = ({ workspace }: { workspace: Workspace }) => {
  return (
    <form className="space-y-4">
      <FormError error={undefined} />
      <div>
        <Label htmlFor="workspace-name">Workspace name</Label>
        <Input
          id="workspace-name"
          name="name"
          type="text"
          defaultValue={workspace.name}
          required
          minLength={3}
          className="mt-1.5"
        />
        <FieldError error={undefined} />
      </div>
      <DialogFooter>
        <SubmitButton label="Save changes" />
      </DialogFooter>
    </form>
  );
};
