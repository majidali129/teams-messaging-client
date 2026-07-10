import { useState } from "react";
import { LayoutGridIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";
import type { ViewMode } from "@/components/shared/view-toggle";
import { WorkspacesHeader } from "./workspaces-header";
import { WorkspaceCard } from "./workspace-card";
import { WorkspaceListItem } from "./workspace-list-item";
import { GridLoadingSkeleton, ListLoadingSkeleton } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { useWorkspaces } from "../hooks/use-workspaces";

export const WorkspacesAllPage = () => {
  const [view, setView] = useState<ViewMode>("grid");
  const {workspaces, isLoading, error} = useWorkspaces()

  console.log('workspaces: ',workspaces)

  const renderLoader = () => {
    if(!isLoading) return null
    return view === 'grid' ? <GridLoadingSkeleton /> : <ListLoadingSkeleton />;
    }

  const renderFallback = () => {
    const hasNoData = !workspaces || workspaces.length === 0;
  
    if (!isLoading && !error && hasNoData) {
      return (
        <Empty
          icon={<LayoutGridIcon />}
          title="No workspaces yet"
          description="Create your first workspace to start collaborating with your team."
        />
      );
    }
    return null;
  };

  const renderContent = () => {
    const hasData = workspaces && workspaces.length > 0;
    
    if (isLoading || error !== null || !hasData) return null;
  
    if (view === 'grid') {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} />
          ))}
        </div>
      );
    }
  
    return (
      <div className="space-y-2">
        {workspaces.map((workspace) => (
          <WorkspaceListItem key={workspace.id} workspace={workspace} />
        ))}
      </div>
    );
  };


  return (
    <div className="mx-auto max-w-5xl space-y-6 p-4 sm:p-6">
      <WorkspacesHeader view={view} onViewChange={setView} />

      {renderLoader()}
      {renderFallback()}
      {renderContent()}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockWorkspaces.slice(0,3).map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}
      </div> */}
      {error && <ErrorState title="Failed to load workspaces" description="Please try again later" /> }
    </div>
  );
};
