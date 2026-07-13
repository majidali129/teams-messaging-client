import {
  CalendarIcon,
  MessagesSquareIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { getInitials } from "@/lib/utils";
import { useWorkspace } from "../../hooks/use-workspace";
import { ErrorState } from "@/components/shared/error-state";

export const WorkspaceOverviewTab = () => {
  const { workspace, isLoading, error } = useWorkspace();
  if (!workspace && !isLoading && error)
    return (
      <ErrorState
        title="Failed to load workspace"
        description="Please try again later"
      />
    );

  const owner = workspace!.owner;

  const stats = [
    { label: "Members", value: workspace!.membersCount, icon: UsersIcon },
    { label: "Chats", value: workspace!.chatsCount, icon: MessagesSquareIcon },
    {
      label: "Status",
      value: workspace!.status,
      icon: ShieldCheckIcon,
      capitalize: true,
    },
    {
      label: "Created",
      value: new Date(workspace!.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      icon: CalendarIcon,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p
                  className={`truncate text-sm font-semibold ${stat.capitalize ? "capitalize" : ""}`}
                >
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-sm font-semibold">About this workspace</h2>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {owner ? getInitials(owner.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {owner?.name ?? "Unknown owner"}
              </p>
              <p className="text-xs text-muted-foreground">
                Workspace owner · {owner?.email}
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Workspace ID</dt>
              <dd className="font-mono text-xs">{workspace!.id}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Last updated</dt>
              <dd>{new Date(workspace!.updatedAt).toLocaleString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
};
