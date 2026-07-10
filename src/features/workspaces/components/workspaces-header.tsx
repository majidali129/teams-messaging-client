import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewToggle, type ViewMode } from "@/components/shared/view-toggle";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";

interface WorkspacesHeaderProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const WorkspacesHeader = ({ view, onViewChange }: WorkspacesHeaderProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Workspaces</h1>
        <p className="text-sm text-muted-foreground">
          All workspaces you own or belong to.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <ViewToggle value={view} onChange={onViewChange} />
        <CreateWorkspaceDialog
          trigger={
            <Button>
              <PlusIcon />
              Create workspace
            </Button>
          }
        />
      </div>
    </div>
  );
};
