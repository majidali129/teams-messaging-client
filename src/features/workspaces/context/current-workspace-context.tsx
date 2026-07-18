import { createContext, useContext, type ReactNode } from "react";
import type { WorkspaceDetails } from "@/types";

const CurrentWorkspaceContext = createContext<WorkspaceDetails | null>(null);

export const CurrentWorkspaceProvider = ({
  workspace,
  children,
}: {
  workspace: WorkspaceDetails;
  children: ReactNode;
}) => {
  return (
    <CurrentWorkspaceContext.Provider value={workspace}>
      {children}
    </CurrentWorkspaceContext.Provider>
  );
};

/**
 * Returns the workspace for the current `/workspaces/:id` route, guaranteed non-null.
 * Only usable inside `WorkspaceDetailsLayout`, which resolves the workspace
 * before rendering its child routes.
 */
export const useCurrentWorkspace = (): WorkspaceDetails => {
  const workspace = useContext(CurrentWorkspaceContext);
  if (!workspace) {
    throw new Error(
      "useCurrentWorkspace must be used within a CurrentWorkspaceProvider (inside WorkspaceDetailsLayout).",
    );
  }
  return workspace;
};
