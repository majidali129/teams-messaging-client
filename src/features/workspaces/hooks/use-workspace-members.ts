import { workspaceApi } from "@/api/services/workspace"
import { queryKeys } from "@/query-keys"
import { useQuery } from "@tanstack/react-query"


export const useWorkspaceMembers = (workspaceId: string) => {
    const {data, isLoading, error} = useQuery({
        queryFn: () => workspaceApi.getMembers(workspaceId),
        queryKey: queryKeys.workspaces.members(workspaceId),
        enabled: !!workspaceId
    })
    return {data: data ?? {members: [], totalCount: 0}, isLoading, error} as const
}