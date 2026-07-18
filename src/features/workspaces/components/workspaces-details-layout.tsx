import { Outlet } from "react-router";
import { ErrorState } from "@/components/shared/error-state";
import { WorkspaceDetailsHeader } from "./workspace-details-header";
import { WorkspaceTabNav } from "./workspace-tab-nav";
import { useWorkspace } from "../hooks/use-workspace";
import { CurrentWorkspaceProvider } from "../context/current-workspace-context";
import { LoadingState } from "@/components/shared/loading-state";

export const WorkspaceDetailsLayout = () => {
  const {workspace, isLoading, error} = useWorkspace();

  if (!workspace && !isLoading && error ) {
    return (
      <div className="flex h-full items-center justify-center">
        <ErrorState
          title="Workspace not found"
          description="This workspace doesn't exist or you no longer have access to it."
        />
      </div>
    );
  }

  if(isLoading) {
    return <LoadingState title="Loading workspace" description="Please wait while we load the workspace" className="h-full" />;
  }

  if(!workspace) {
    return <ErrorState
      title="Workspace not found"
      description="This workspace doesn't exist or you no longer have access to it."
    />
  }

  return (
    <CurrentWorkspaceProvider workspace={workspace}>
      <div className="flex h-full flex-col">
        <WorkspaceDetailsHeader workspace={workspace} />
        <WorkspaceTabNav workspaceId={workspace.id} />
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </CurrentWorkspaceProvider>
  );
};
