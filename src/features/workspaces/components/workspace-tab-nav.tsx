import { NavLink } from "react-router";
import { cn } from "@/lib/utils";
import {
  workspaceChatsPath,
  workspaceInvitesPath,
  workspaceMembersPath,
  workspaceOverviewPath,
} from "@/paths";

export const WorkspaceTabNav = ({ workspaceId }: { workspaceId: string }) => {
  const tabs = [
    { label: "Overview", to: workspaceOverviewPath(workspaceId) },
    { label: "Members", to: workspaceMembersPath(workspaceId) },
    { label: "Invites", to: workspaceInvitesPath(workspaceId) },
    { label: "Chats", to: workspaceChatsPath(workspaceId) },
  ];

  return (
    <div className="overflow-x-auto border-b px-4 sm:px-6">
      <nav className="flex w-max min-w-full gap-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              cn(
                "shrink-0 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};
