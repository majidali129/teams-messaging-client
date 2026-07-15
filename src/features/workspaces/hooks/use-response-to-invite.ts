import { invitesApi } from "@/api/services/invite";
import { queryKeys } from "@/query-keys";
import type { AcceptInviteInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useResponseToInvite = (workspaceId: string) => {
    const queryClient = useQueryClient()
    const { mutate: respondToInvite, isPending } = useMutation({
        mutationFn: ({ inviteId, input }: { inviteId: string, input: AcceptInviteInput }) => invitesApi
        .respond(inviteId, input),
        onSuccess: (_data, {input}) => {
            queryClient.invalidateQueries({ queryKey: queryKeys.invites.received() });
            queryClient.invalidateQueries({ queryKey: queryKeys.invites.all(workspaceId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(workspaceId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(workspaceId) });
            queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(workspaceId) });
            toast.success(`Invite ${input.status === 'accepted' ? 'accepted' : 'declined'} successfully`);
        },
        onError: (_error, variables) => {
            const isAccepted = variables.input.status === 'accepted';
            
            toast.error(`Failed to ${isAccepted ? 'accept' : 'decline'} invite`);
          },
    })
    return { respondToInvite, isPending }
}