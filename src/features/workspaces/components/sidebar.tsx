import { Link, NavLink } from "react-router";
import {
  LayoutGridIcon,
  MessagesSquareIcon,
  PlusIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn, getInitials } from "@/lib/utils";
import { allWorkspacesPath, homePath, workspacePath } from "@/paths";
import { CreateWorkspaceDialog } from "./create-workspace-dialog";
import { useWorkspaces } from "../hooks/use-workspaces";
import { Skeleton } from "@/components/ui/skeleton";

const SIDEBAR_WORKSPACE_LIMIT = 4;

export const WorkspacesSidebarContent = () => {
  const { data, isLoading } = useWorkspaces();

  const { workspaces } = data ?? { workspaces: [], totalCount: 0 };
  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <Link
        to={homePath()}
        className="flex items-center gap-2 border-b border-sidebar-border px-4 py-4"
      >
        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <MessagesSquareIcon className="size-4.5" />
        </div>
        <span className="text-base font-semibold">TeamSync</span>
      </Link>

      <nav className="flex-1 space-y-4 overflow-y-auto p-3">
        <div>
          <div className="mb-4 flex items-center justify-between px-2">
            <span className="text-xs font-medium text-sidebar-foreground/60">
              Workspaces
            </span>
            <CreateWorkspaceDialog
              trigger={
                <Button
                  variant="secondary"
                  size="icon-xs"
                  className="text-sidebar-foreground/60 hover:text-sidebar-foreground"
                  title="Create workspace"
                >
                  <PlusIcon />
                </Button>
              }
            />
          </div>

          <div>
            {isLoading ? (
              <ul className="space-y-1">
                {Array.from({ length: 2 }).map((_, index) => (
                  <li key={index}>
                    <Skeleton className="h-10 w-full" />
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-0.5">
                {!isLoading &&
                  workspaces
                    .slice(0, SIDEBAR_WORKSPACE_LIMIT)
                    .map((workspace) => (
                      <li key={workspace.id}>
                        <NavLink
                          to={workspacePath(workspace.id)}
                          className={({ isActive }) =>
                            cn(
                              "flex items-center gap-2.5 rounded-lg px-2 py-1 text-sm transition-colors",
                              isActive
                                ? "bg-primary/10 text-sidebar-accent-foreground font-medium"
                                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                            )
                          }
                        >
                          <Avatar size="default">
                            <AvatarFallback>
                              {getInitials(workspace.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">{workspace.name}</span>
                        </NavLink>
                      </li>
                    ))}
              </ul>
            )}
          </div>
        </div>

        <NavLink
          to={allWorkspacesPath()}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors",
              isActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
            )
          }
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-sidebar-accent/60">
            <LayoutGridIcon className="size-3.5" />
          </span>
          View all workspaces
        </NavLink>
      </nav>
    </div>
  );
};
