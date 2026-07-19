import { invitesApi } from "@/api/services/invite";
import { queryKeys } from "@/query-keys";
import { workspaceOverviewPath, workspacesPath } from "@/paths";
import type { AcceptInviteInput } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";


type RespondOptions = {
  workspaceId?: string;
  redirectOnAccept?: boolean;
  redirectOnDecline?: boolean;
};

export const useResponseToInvite = (options: RespondOptions = {}) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const {
      workspaceId: defaultWorkspaceId,
      redirectOnAccept = false,
      redirectOnDecline = false,
    } = options;

    const { mutate: respondToInvite, isPending } = useMutation({
        mutationFn: ({ inviteId, input }: { inviteId: string, input: AcceptInviteInput }) =>
          invitesApi.respond(inviteId, input),
        onSuccess: (data, { input }) => {
            const resolvedWorkspaceId = data.workspaceId || defaultWorkspaceId || input.workspaceId;
            if (resolvedWorkspaceId) {
              queryClient.invalidateQueries({ queryKey: queryKeys.invites.all(resolvedWorkspaceId) });
              queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(resolvedWorkspaceId) });
              queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.details(resolvedWorkspaceId) });
              queryClient.invalidateQueries({ queryKey: queryKeys.chats.all(resolvedWorkspaceId) });
            }
            queryClient.invalidateQueries({ queryKey: queryKeys.invites.received() });
            queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.all });

            const isAccepted = input.status === 'accepted';
            toast.success(`Invite ${isAccepted ? 'accepted' : 'declined'} successfully`);

            if (isAccepted && redirectOnAccept && resolvedWorkspaceId) {
              navigate(workspaceOverviewPath(resolvedWorkspaceId), { replace: true });
            } else if (!isAccepted && redirectOnDecline) {
              navigate(workspacesPath(), { replace: true });
            }
        },
        onError: (error, variables) => {
            const isAccepted = variables.input.status === 'accepted';
            toast.error(error.message || `Failed to ${isAccepted ? 'accept' : 'decline'} invite`);
          },
    })
    return { respondToInvite, isPending }
}
