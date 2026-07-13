import { invitesApi } from "@/api/services/invite"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useWorkspaceInvites = (workspaceId: string) => {
    const {data, isLoading, error} = useQuery({
        queryFn: () => invitesApi.getAll(workspaceId),
        queryKey: queryKeys.invites.all(workspaceId),
        enabled: !!workspaceId
    })
    return {data: data ?? {invites: [], totalCount: 0}, isLoading, error} as const
}   