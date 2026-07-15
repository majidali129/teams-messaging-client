import { BellIcon, Loader2, LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RoleBadge } from "./role-badge";
import { useQuery } from "@tanstack/react-query";
import { invitesApi } from "@/api/services/invite";
import { queryKeys } from "@/query-keys";
import { Badge } from "../ui/badge";
import { Empty } from "./empty";
import { LoadingState } from "./loading-state";
import { useWorkspace } from "@/features/workspaces/hooks/use-workspace";
import { useResponseToInvite } from "@/features/workspaces/hooks/use-response-to-invite";


export const UserReceivedInvites = () => {
    const {workspace} = useWorkspace()
    const { data, isLoading } = useQuery({
        queryFn: () => invitesApi.getReceived(),
        queryKey: queryKeys.invites.received(),
    })

    const { respondToInvite, isPending } = useResponseToInvite(workspace?.id as string)

    const renderLoader = () => isLoading? <LoadingState title="Loading your invites" description="Please wait while we load your invites" /> : null;
    const renderFallback = () => !isLoading && data?.invites.length === 0 ? <Empty title="No pending invites" description="You're all caught up." /> : null;
    
    const {invites, total} = data ?? {invites: [], total: 0};

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button variant="ghost" size="icon" className="relative" aria-label="Invites" />
                }
            >
                <BellIcon />
                {total > 0 && (
                    <Badge className="absolute -top-1 -right-1 size-4.5 justify-center rounded-full p-0 text-[10px]">
                        {total}
                    </Badge>
                )}
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0">
                    <div className="border-b px-3 py-2.5 text-sm font-medium">Invites for you</div>
                {renderLoader()}
                    {renderFallback()}
                        {invites?.length > 0 && <ul className="max-h-80 divide-y overflow-y-auto">
                            {invites?.map((invite) => {
                                return (
                                    <li key={invite.id} className="space-y-2 px-3 py-3">
                                        <div className="flex items-start justify-between gap-2">
                                            <div>
                                                <p className="text-sm font-medium">{workspace?.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Invited by {invite.invitedBy.name} · as {invite.role}
                                                </p>
                                            </div>
                                            <RoleBadge role={invite.role} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" className="flex-1" onClick={() => respondToInvite({ inviteId: invite.id, input: { status: 'accepted' } })} disabled={isPending}>
                                                {isPending ? <LoaderCircle className="size-4 animate-spin" /> : 'Accept'}
                                            </Button>
                                            <Button size="sm" variant="outline" className="flex-1" onClick={() => respondToInvite({ inviteId: invite.id, input: { status: 'declined' } })} disabled={isPending}>
                                                {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Decline'}
                                            </Button>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>}
            </PopoverContent>
        </Popover>
    );
}