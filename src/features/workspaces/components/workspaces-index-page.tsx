import { LayoutGridIcon } from "lucide-react";
import { Empty } from "@/components/shared/empty";
import { allWorkspacesPath } from "@/paths";

export const WorkspacesIndexPage = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Empty
        icon={<LayoutGridIcon />}
        title="Select a workspace"
        description="Choose a workspace from the sidebar to view its overview, members, invites, and chats."
        action={{ label: "View all workspaces", href: allWorkspacesPath() }}
      />
    </div>
  );
};
