import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

/** Full-area loading indicator — e.g. for a page or tab panel. */
export function LoadingState({ className, title, description }: { className?: string, title?: string, description?: string }) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center gap-3 py-16", className)}>
      <Spinner className="size-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">{title || "Loading…"}</p>
      <p className="text-sm text-muted-foreground">{description || "Please wait while we load the content"}</p>
    </div>
  );
}

/** Skeleton rows for list-style content (members, invites, chats). */
export function ListLoadingSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-lg border p-3">
          <Skeleton className="size-9 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Skeleton tiles for grid-style content (workspace cards). */
export function GridLoadingSkeleton({ tiles = 6 }: { tiles?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: tiles }).map((_, index) => (
        <div key={index} className="space-y-3 rounded-xl border p-4">
          <Skeleton className="size-10 rounded-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
